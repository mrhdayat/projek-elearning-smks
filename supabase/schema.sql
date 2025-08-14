

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."assignment_type" AS ENUM (
    'Tugas',
    'Ujian'
);


ALTER TYPE "public"."assignment_type" OWNER TO "postgres";


CREATE TYPE "public"."day_of_week_enum" AS ENUM (
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
    'Minggu'
);


ALTER TYPE "public"."day_of_week_enum" OWNER TO "postgres";


CREATE TYPE "public"."material_type" AS ENUM (
    'file',
    'link',
    'text'
);


ALTER TYPE "public"."material_type" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'Admin',
    'Guru BK',
    'Guru Mapel',
    'Wali Kelas',
    'Siswa',
    'Kepala Sekolah'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


COMMENT ON TYPE "public"."user_role" IS 'Daftar peran yang valid untuk pengguna dalam sistem.';



CREATE OR REPLACE FUNCTION "public"."create_announcement"("title" "text", "content" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF (SELECT public.get_user_role(auth.uid())) NOT IN ('Admin', 'Super Admin') THEN
    RAISE EXCEPTION 'Hanya admin yang boleh membuat pengumuman.';
  END IF;
  INSERT INTO public.announcements (title, content, creator_id)
  VALUES (title, content, auth.uid());
END;
$$;


ALTER FUNCTION "public"."create_announcement"("title" "text", "content" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_assignment"("title" "text", "description" "text", "type" "public"."assignment_type", "course_id" bigint, "due_date" timestamp with time zone) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Keamanan: Periksa apakah pengguna saat ini adalah Admin atau Guru
  IF (SELECT public.get_user_role(auth.uid())) NOT IN ('Admin', 'Super Admin', 'Guru Mapel', 'Guru BK', 'Wali Kelas') THEN
    RAISE EXCEPTION 'Hanya admin atau guru yang boleh membuat tugas/ujian.';
  END IF;

  -- Jika aman, masukkan data baru ke tabel assignments
  INSERT INTO public.assignments (title, description, type, course_id, due_date, creator_id)
  VALUES (title, description, type, course_id, due_date, auth.uid());
END;
$$;


ALTER FUNCTION "public"."create_assignment"("title" "text", "description" "text", "type" "public"."assignment_type", "course_id" bigint, "due_date" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_course"("name" "text", "description" "text", "teacher_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Langkah Keamanan: Periksa apakah pengguna saat ini adalah Admin
  IF (SELECT public.get_user_role(auth.uid())) NOT IN ('Admin', 'Super Admin') THEN
    RAISE EXCEPTION 'Hanya admin yang boleh menambahkan mata pelajaran baru.';
  END IF;

  -- Jika aman, masukkan data baru ke tabel courses
  INSERT INTO public.courses (name, description, teacher_id)
  VALUES (name, description, teacher_id);
END;
$$;


ALTER FUNCTION "public"."create_course"("name" "text", "description" "text", "teacher_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_material"("title" "text", "course_id" bigint, "type" "public"."material_type", "content" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Keamanan: Pastikan hanya Admin atau Guru yang bisa membuat materi
  IF (SELECT public.get_user_role(auth.uid())) NOT IN ('Admin', 'Super Admin', 'Guru Mapel', 'Guru BK', 'Wali Kelas') THEN
    RAISE EXCEPTION 'Hanya admin atau guru yang boleh menambahkan materi baru.';
  END IF;

  -- Masukkan data baru ke tabel materials
  INSERT INTO public.materials (title, course_id, type, content, uploader_id)
  VALUES (title, course_id, type, content, auth.uid());
END;
$$;


ALTER FUNCTION "public"."create_material"("title" "text", "course_id" bigint, "type" "public"."material_type", "content" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_schedule_entry"("course_id" bigint, "day_of_week" "public"."day_of_week_enum", "start_time" time without time zone, "end_time" time without time zone, "class_group" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Keamanan: Periksa apakah pengguna saat ini adalah Admin
  IF (SELECT public.get_user_role(auth.uid())) NOT IN ('Admin', 'Super Admin') THEN
    RAISE EXCEPTION 'Hanya admin yang boleh membuat jadwal baru.';
  END IF;

  -- Jika aman, masukkan data baru ke tabel schedules
  INSERT INTO public.schedules (course_id, day_of_week, start_time, end_time, class_group)
  VALUES (course_id, day_of_week, start_time, end_time, class_group);
END;
$$;


ALTER FUNCTION "public"."create_schedule_entry"("course_id" bigint, "day_of_week" "public"."day_of_week_enum", "start_time" time without time zone, "end_time" time without time zone, "class_group" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_user_sync_trigger"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  EXECUTE 'CREATE TRIGGER on_auth_user_modified
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user()';
END;
$$;


ALTER FUNCTION "public"."create_user_sync_trigger"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_announcement"("announcement_id" bigint) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF (SELECT public.get_user_role(auth.uid())) NOT IN ('Admin', 'Super Admin') THEN
    RAISE EXCEPTION 'Hanya admin yang boleh menghapus pengumuman.';
  END IF;
  DELETE FROM public.announcements WHERE id = announcement_id;
END;
$$;


ALTER FUNCTION "public"."delete_announcement"("announcement_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_assignment"("assignment_id" bigint) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Keamanan: Pastikan hanya Admin atau Guru yang bisa menjalankan
  IF (SELECT public.get_user_role(auth.uid())) NOT IN ('Admin', 'Super Admin', 'Guru Mapel', 'Guru BK', 'Wali Kelas') THEN
    RAISE EXCEPTION 'Hanya admin atau guru yang boleh menghapus tugas/ujian.';
  END IF;

  DELETE FROM public.assignments WHERE id = assignment_id;
END;
$$;


ALTER FUNCTION "public"."delete_assignment"("assignment_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_course"("course_id" bigint) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Keamanan: Pastikan hanya Admin yang bisa menjalankan
  IF (SELECT public.get_user_role(auth.uid())) NOT IN ('Admin', 'Super Admin') THEN
    RAISE EXCEPTION 'Hanya admin yang boleh menghapus mata pelajaran.';
  END IF;

  -- Jika aman, hapus data dari tabel courses
  DELETE FROM public.courses WHERE id = course_id;
END;
$$;


ALTER FUNCTION "public"."delete_course"("course_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_schedule_entry"("schedule_id" bigint) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Keamanan
  IF (SELECT public.get_user_role(auth.uid())) NOT IN ('Admin', 'Super Admin') THEN
    RAISE EXCEPTION 'Hanya admin yang boleh menghapus jadwal.';
  END IF;

  DELETE FROM public.schedules WHERE id = schedule_id;
END;
$$;


ALTER FUNCTION "public"."delete_schedule_entry"("schedule_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_all_announcements_with_details"() RETURNS TABLE("id" bigint, "title" "text", "content" "text", "creator_name" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.title,
    a.content,
    p.full_name AS creator_name,
    a.created_at
  FROM
    public.announcements AS a
  LEFT JOIN
    public.profiles AS p ON a.creator_id = p.id
  ORDER BY
    a.created_at DESC;
END;
$$;


ALTER FUNCTION "public"."get_all_announcements_with_details"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_all_assignments_with_details"() RETURNS TABLE("id" bigint, "title" "text", "description" "text", "type" "public"."assignment_type", "course_name" "text", "creator_name" "text", "due_date" timestamp with time zone, "created_at" timestamp with time zone)
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.title,
    a.description,
    a.type,
    c.name as course_name,
    p.full_name as creator_name,
    a.due_date,
    a.created_at
  FROM
    public.assignments AS a
  LEFT JOIN
    public.courses AS c ON a.course_id = c.id
  LEFT JOIN
    public.profiles AS p ON a.creator_id = p.id
  ORDER BY
    a.due_date DESC;
END;
$$;


ALTER FUNCTION "public"."get_all_assignments_with_details"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_all_courses"() RETURNS TABLE("id" bigint, "name" "text")
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT c.id, c.name FROM public.courses AS c ORDER BY c.name ASC;
$$;


ALTER FUNCTION "public"."get_all_courses"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_all_courses_with_details"() RETURNS TABLE("id" bigint, "name" "text", "description" "text", "teacher_name" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.description,
    p.full_name AS teacher_name, -- Mengambil nama guru dari tabel profiles
    c.created_at
  FROM
    public.courses AS c
  -- LEFT JOIN digunakan agar mata pelajaran tetap tampil meskipun belum punya guru
  LEFT JOIN
    public.profiles AS p ON c.teacher_id = p.id
  ORDER BY
    c.created_at DESC;
END;
$$;


ALTER FUNCTION "public"."get_all_courses_with_details"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_all_materials_with_details"() RETURNS TABLE("id" bigint, "title" "text", "type" "public"."material_type", "course_name" "text", "uploader_name" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.title,
    m.type,
    c.name AS course_name,
    p.full_name AS uploader_name,
    m.created_at
  FROM
    public.materials AS m
  LEFT JOIN
    public.courses AS c ON m.course_id = c.id
  LEFT JOIN
    public.profiles AS p ON m.uploader_id = p.id
  ORDER BY
    m.created_at DESC;
END;
$$;


ALTER FUNCTION "public"."get_all_materials_with_details"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."settings" (
    "id" "text" NOT NULL,
    "value" "text",
    "label" "text",
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."settings" OWNER TO "postgres";


COMMENT ON TABLE "public"."settings" IS 'Menyimpan pengaturan global untuk aplikasi.';



CREATE OR REPLACE FUNCTION "public"."get_all_settings"() RETURNS SETOF "public"."settings"
    LANGUAGE "sql" STABLE
    AS $$
  SELECT * FROM public.settings;
$$;


ALTER FUNCTION "public"."get_all_settings"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_all_teachers"() RETURNS TABLE("id" "uuid", "full_name" "text")
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.full_name
  FROM
    public.profiles AS p
  WHERE
    -- Ambil semua jenis peran yang dianggap sebagai pengajar
    p.role IN ('Guru Mapel', 'Guru BK', 'Wali Kelas', 'Kepala Sekolah')
  ORDER BY
    p.full_name ASC;
END;
$$;


ALTER FUNCTION "public"."get_all_teachers"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_all_users_with_details"() RETURNS TABLE("id" "uuid", "full_name" "text", "email" "text", "role" "public"."user_role", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.full_name,
    u.email::text, -- Casting tipe email menjadi text
    p.role,
    u.created_at
  FROM
    public.profiles AS p
  JOIN
    auth.users AS u ON p.id = u.id
  ORDER BY
    u.created_at DESC;
END;
$$;


ALTER FUNCTION "public"."get_all_users_with_details"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_all_users_with_details"() IS 'Mengambil semua pengguna dengan detail dari tabel profiles dan auth.users (v2).';



CREATE OR REPLACE FUNCTION "public"."get_announcement_by_id"("announcement_id" bigint) RETURNS "jsonb"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT row_to_json(a) FROM public.announcements AS a WHERE a.id = announcement_id;
$$;


ALTER FUNCTION "public"."get_announcement_by_id"("announcement_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_assignment_details_by_id"("assignment_id" bigint) RETURNS "jsonb"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT row_to_json(a)
  FROM public.assignments AS a
  WHERE a.id = assignment_id;
$$;


ALTER FUNCTION "public"."get_assignment_details_by_id"("assignment_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_course_details_by_id"("course_id" bigint) RETURNS "jsonb"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  -- Mengembalikan semua kolom dari tabel courses dalam format JSON
  SELECT row_to_json(c)
  FROM public.courses AS c
  WHERE c.id = course_id;
$$;


ALTER FUNCTION "public"."get_course_details_by_id"("course_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_current_user_profile"() RETURNS TABLE("full_name" "text", "role" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Menggunakan RETURN QUERY untuk mengembalikan hasil dari sebuah SELECT
  RETURN QUERY
  SELECT
    p.full_name,
    p.role
  FROM
    public.profiles AS p
  WHERE
    -- Kondisi WHERE yang krusial: ID profil harus sama dengan ID pengguna yang memanggil fungsi ini
    p.id = auth.uid ();
END;
$$;


ALTER FUNCTION "public"."get_current_user_profile"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_current_user_profile"() IS 'Mengambil nama lengkap dan peran dari pengguna yang sedang login.';



CREATE OR REPLACE FUNCTION "public"."get_dashboard_stats"() RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'siswa', (
      SELECT jsonb_build_object(
        'total', count(*),
        'growth', count(*) FILTER (WHERE p.created_at > now() - interval '30 days')
      ) FROM public.profiles p WHERE p.role = 'Siswa'
    ),
    'guru', (
      SELECT jsonb_build_object(
        'total', count(*),
        'growth', count(*) FILTER (WHERE p.created_at > now() - interval '30 days')
      ) FROM public.profiles p WHERE p.role IN ('Guru BK', 'Guru Mapel', 'Wali Kelas', 'Kepala Sekolah', 'Admin')
    ),
    'kelas', (
      SELECT jsonb_build_object(
        'total', count(*),
        'growth', count(*) FILTER (WHERE c.created_at > now() - interval '30 days')
      ) FROM public.courses c
    ),
    'materi', (
      SELECT jsonb_build_object(
        'total', count(*),
        'growth', count(*) FILTER (WHERE m.created_at > now() - interval '30 days')
      ) FROM public.materials m
    )
  ) INTO stats;
  
  RETURN stats;
END;
$$;


ALTER FUNCTION "public"."get_dashboard_stats"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_dashboard_stats"() IS 'Mengambil data statistik utama untuk halaman dashboard admin.';



CREATE OR REPLACE FUNCTION "public"."get_full_schedule"() RETURNS TABLE("id" bigint, "course_name" "text", "teacher_name" "text", "day_of_week" "public"."day_of_week_enum", "start_time" time without time zone, "end_time" time without time zone, "class_group" "text")
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    c.name AS course_name,
    p.full_name AS teacher_name,
    s.day_of_week,
    s.start_time,
    s.end_time,
    s.class_group
  FROM
    public.schedules AS s
  LEFT JOIN
    public.courses AS c ON s.course_id = c.id
  LEFT JOIN
    public.profiles AS p ON c.teacher_id = p.id
  ORDER BY
    s.start_time, s.day_of_week;
END;
$$;


ALTER FUNCTION "public"."get_full_schedule"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_latest_activity_logs"() RETURNS TABLE("id" bigint, "user_name" "text", "action_type" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    al.id,
    p.full_name as user_name,
    al.action_type,
    al.created_at
  FROM
    public.activity_log AS al
  LEFT JOIN
    public.profiles AS p ON al.user_id = p.id
  ORDER BY
    al.created_at DESC -- Urutkan dari yang paling baru
  LIMIT 5; -- Batasi 5 log teratas
END;
$$;


ALTER FUNCTION "public"."get_latest_activity_logs"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_latest_assignments"() RETURNS TABLE("id" bigint, "title" "text", "course_name" "text", "teacher_name" "text", "due_date" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.title,
    c.name as course_name,
    p.full_name as teacher_name,
    a.due_date
  FROM
    public.assignments AS a
  LEFT JOIN
    public.courses AS c ON a.course_id = c.id
  LEFT JOIN
    public.profiles AS p ON c.teacher_id = p.id
  WHERE
    a.due_date >= now() -- Hanya ambil tugas yang belum jatuh tempo
  ORDER BY
    a.due_date ASC -- Urutkan dari yang paling dekat deadline-nya
  LIMIT 3; -- Batasi hanya 3 tugas teratas
END;
$$;


ALTER FUNCTION "public"."get_latest_assignments"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_material_details_by_id"("material_id" bigint) RETURNS "jsonb"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT row_to_json(m)
  FROM public.materials AS m
  WHERE m.id = material_id;
$$;


ALTER FUNCTION "public"."get_material_details_by_id"("material_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_paginated_activity_logs"("page_size" integer, "page_number" integer) RETURNS "jsonb"
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
DECLARE
  total_rows bigint;
  results jsonb;
BEGIN
  -- Hitung total semua baris untuk kalkulasi total halaman
  SELECT count(*) INTO total_rows FROM public.activity_log;
  
  -- Ambil data untuk halaman yang diminta
  SELECT jsonb_agg(t) INTO results FROM (
    SELECT
      al.id,
      p.full_name as user_name,
      al.action_type,
      al.created_at
    FROM
      public.activity_log AS al
    LEFT JOIN
      public.profiles AS p ON al.user_id = p.id
    ORDER BY
      al.created_at DESC
    LIMIT page_size
    OFFSET (page_number - 1) * page_size
  ) t;
  
  -- PERBAIKAN: Tambahkan 'RETURN' di sini
  RETURN jsonb_build_object(
    'total_count', total_rows,
    'data', results
  );
END;
$$;


ALTER FUNCTION "public"."get_paginated_activity_logs"("page_size" integer, "page_number" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_paginated_assignments"("page_size" integer, "page_number" integer) RETURNS "jsonb"
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
DECLARE
  total_rows bigint;
  results jsonb;
BEGIN
  SELECT count(*) INTO total_rows FROM public.assignments;
  
  SELECT jsonb_agg(t) INTO results FROM (
    SELECT
      a.id, a.title, a.description, a.type, c.name as course_name, p.full_name as creator_name, a.due_date, a.created_at
    FROM public.assignments AS a
    LEFT JOIN public.courses AS c ON a.course_id = c.id
    LEFT JOIN public.profiles AS p ON a.creator_id = p.id
    ORDER BY a.due_date DESC
    LIMIT page_size
    OFFSET (page_number - 1) * page_size
  ) t;
  
  RETURN jsonb_build_object(
    'total_count', total_rows,
    'data', results
  );
END;
$$;


ALTER FUNCTION "public"."get_paginated_assignments"("page_size" integer, "page_number" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_paginated_assignments"("page_size" integer, "page_number" integer, "show_expired" boolean DEFAULT false) RETURNS "jsonb"
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
DECLARE
  total_rows bigint;
  results jsonb;
BEGIN
  -- Hitung total baris berdasarkan filter
  SELECT count(*) INTO total_rows 
  FROM public.assignments a
  WHERE (show_expired IS TRUE OR a.due_date >= now());

  -- Ambil data berdasarkan filter dan pagination
  SELECT jsonb_agg(t) INTO results FROM (
    SELECT
      a.id, a.title, a.description, a.type, c.name as course_name, p.full_name as creator_name, a.due_date, a.created_at
    FROM public.assignments AS a
    LEFT JOIN public.courses AS c ON a.course_id = c.id
    LEFT JOIN public.profiles AS p ON a.creator_id = p.id
    WHERE 
      -- Logika filter: tampilkan semua jika show_expired, jika tidak, hanya tampilkan yang akan datang
      (show_expired IS TRUE OR a.due_date >= now())
    ORDER BY a.due_date DESC
    LIMIT page_size
    OFFSET (page_number - 1) * page_size
  ) t;
  
  RETURN jsonb_build_object(
    'total_count', total_rows,
    'data', results
  );
END;
$$;


ALTER FUNCTION "public"."get_paginated_assignments"("page_size" integer, "page_number" integer, "show_expired" boolean) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_paginated_courses"("page_size" integer, "page_number" integer) RETURNS "jsonb"
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
DECLARE
  total_rows bigint;
  results jsonb;
BEGIN
  SELECT count(*) INTO total_rows FROM public.courses;
  
  SELECT jsonb_agg(t) INTO results FROM (
    SELECT
      c.id, c.name, c.description, p.full_name AS teacher_name, c.created_at
    FROM public.courses AS c
    LEFT JOIN public.profiles AS p ON c.teacher_id = p.id
    ORDER BY c.created_at DESC
    LIMIT page_size
    OFFSET (page_number - 1) * page_size
  ) t;
  
  RETURN jsonb_build_object(
    'total_count', total_rows,
    'data', results
  );
END;
$$;


ALTER FUNCTION "public"."get_paginated_courses"("page_size" integer, "page_number" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_paginated_materials"("page_size" integer, "page_number" integer) RETURNS "jsonb"
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
DECLARE
  total_rows bigint;
  results jsonb;
BEGIN
  SELECT count(*) INTO total_rows FROM public.materials;
  
  SELECT jsonb_agg(t) INTO results FROM (
    SELECT
      m.id, m.title, m.type, c.name AS course_name, p.full_name AS uploader_name, m.created_at
    FROM public.materials AS m
    LEFT JOIN public.courses AS c ON m.course_id = c.id
    LEFT JOIN public.profiles AS p ON m.uploader_id = p.id
    ORDER BY m.created_at DESC
    LIMIT page_size
    OFFSET (page_number - 1) * page_size
  ) t;
  
  RETURN jsonb_build_object(
    'total_count', total_rows,
    'data', results
  );
END;
$$;


ALTER FUNCTION "public"."get_paginated_materials"("page_size" integer, "page_number" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_paginated_users"("page_size" integer, "page_number" integer) RETURNS "jsonb"
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
DECLARE
  total_rows bigint;
  results jsonb;
BEGIN
  SELECT count(*) INTO total_rows FROM public.profiles;
  
  SELECT jsonb_agg(t) INTO results FROM (
    SELECT
      p.id,
      p.full_name,
      u.email,
      p.role,
      u.created_at
    FROM
      public.profiles AS p
    JOIN
      auth.users AS u ON p.id = u.id
    ORDER BY
      u.created_at DESC
    LIMIT page_size
    OFFSET (page_number - 1) * page_size
  ) t;
  
  RETURN jsonb_build_object(
    'total_count', total_rows,
    'data', results
  );
END;
$$;


ALTER FUNCTION "public"."get_paginated_users"("page_size" integer, "page_number" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_schedule_details_by_id"("schedule_id" bigint) RETURNS "jsonb"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT row_to_json(s) FROM public.schedules AS s WHERE s.id = schedule_id;
$$;


ALTER FUNCTION "public"."get_schedule_details_by_id"("schedule_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_details_by_id"("user_id" "uuid") RETURNS "jsonb"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT row_to_json(p)
  FROM public.profiles AS p
  WHERE p.id = user_id;
$$;


ALTER FUNCTION "public"."get_user_details_by_id"("user_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_user_details_by_id"("user_id" "uuid") IS 'Mengambil detail profil satu pengguna berdasarkan ID.';



CREATE OR REPLACE FUNCTION "public"."get_user_role"("user_id" "uuid") RETURNS "text"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;


ALTER FUNCTION "public"."get_user_role"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_weekly_activity"() RETURNS TABLE("day_name" "text", "siswa_activity" bigint, "guru_activity" bigint)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  WITH daily_activity AS (
    SELECT
      to_char(al.created_at, 'Day') AS day,
      date_trunc('day', al.created_at) AS activity_date,
      p.role
    FROM
      public.activity_log AS al
    LEFT JOIN
      public.profiles AS p ON al.user_id = p.id
    WHERE
      al.created_at >= now() - interval '7 days'
      -- PERBAIKAN: Sertakan semua peran yang relevan di sini
      AND p.role IS NOT NULL
  )
  SELECT
    TRIM(da.day) AS day_name,
    count(*) FILTER (WHERE da.role = 'Siswa') AS siswa_activity,
    -- PERBAIKAN: Hitung semua yang BUKAN siswa sebagai aktivitas guru/staf
    count(*) FILTER (WHERE da.role != 'Siswa') AS guru_activity
  FROM
    daily_activity AS da
  GROUP BY
    activity_date, day_name
  ORDER BY
    activity_date ASC;
END;
$$;


ALTER FUNCTION "public"."get_weekly_activity"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_announcement"("announcement_id" bigint, "new_title" "text", "new_content" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF (SELECT public.get_user_role(auth.uid())) NOT IN ('Admin', 'Super Admin') THEN
    RAISE EXCEPTION 'Hanya admin yang boleh mengubah pengumuman.';
  END IF;
  UPDATE public.announcements SET title = new_title, content = new_content WHERE id = announcement_id;
END;
$$;


ALTER FUNCTION "public"."update_announcement"("announcement_id" bigint, "new_title" "text", "new_content" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_assignment"("assignment_id" bigint, "new_title" "text", "new_description" "text", "new_type" "public"."assignment_type", "new_course_id" bigint, "new_due_date" timestamp with time zone) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Keamanan: Pastikan hanya Admin atau Guru yang bisa menjalankan
  IF (SELECT public.get_user_role(auth.uid())) NOT IN ('Admin', 'Super Admin', 'Guru Mapel', 'Guru BK', 'Wali Kelas') THEN
    RAISE EXCEPTION 'Hanya admin atau guru yang boleh mengubah tugas/ujian.';
  END IF;

  UPDATE public.assignments
  SET
    title = new_title,
    description = new_description,
    type = new_type,
    course_id = new_course_id,
    due_date = new_due_date
  WHERE
    id = assignment_id;
END;
$$;


ALTER FUNCTION "public"."update_assignment"("assignment_id" bigint, "new_title" "text", "new_description" "text", "new_type" "public"."assignment_type", "new_course_id" bigint, "new_due_date" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_course"("course_id" bigint, "new_name" "text", "new_description" "text", "new_teacher_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Keamanan: Pastikan hanya Admin yang bisa menjalankan
  IF (SELECT public.get_user_role(auth.uid())) NOT IN ('Admin', 'Super Admin') THEN
    RAISE EXCEPTION 'Hanya admin yang boleh mengubah mata pelajaran.';
  END IF;

  -- Jika aman, perbarui data di tabel courses
  UPDATE public.courses
  SET
    name = new_name,
    description = new_description,
    teacher_id = new_teacher_id
  WHERE
    id = course_id;
END;
$$;


ALTER FUNCTION "public"."update_course"("course_id" bigint, "new_name" "text", "new_description" "text", "new_teacher_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_material_details"("material_id" bigint, "new_title" "text", "new_course_id" bigint) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Keamanan: Pastikan hanya Admin atau Guru yang bisa menjalankan
  IF (SELECT public.get_user_role(auth.uid())) NOT IN ('Admin', 'Super Admin', 'Guru Mapel', 'Guru BK', 'Wali Kelas') THEN
    RAISE EXCEPTION 'Hanya admin atau guru yang boleh mengubah materi.';
  END IF;

  -- Jika aman, perbarui data di tabel materials
  UPDATE public.materials
  SET
    title = new_title,
    course_id = new_course_id
  WHERE
    id = material_id;
END;
$$;


ALTER FUNCTION "public"."update_material_details"("material_id" bigint, "new_title" "text", "new_course_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_schedule_entry"("schedule_id" bigint, "new_course_id" bigint, "new_day_of_week" "public"."day_of_week_enum", "new_start_time" time without time zone, "new_end_time" time without time zone, "new_class_group" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Keamanan
  IF (SELECT public.get_user_role(auth.uid())) NOT IN ('Admin', 'Super Admin') THEN
    RAISE EXCEPTION 'Hanya admin yang boleh mengubah jadwal.';
  END IF;

  UPDATE public.schedules
  SET
    course_id = new_course_id,
    day_of_week = new_day_of_week,
    start_time = new_start_time,
    end_time = new_end_time,
    class_group = new_class_group
  WHERE
    id = schedule_id;
END;
$$;


ALTER FUNCTION "public"."update_schedule_entry"("schedule_id" bigint, "new_course_id" bigint, "new_day_of_week" "public"."day_of_week_enum", "new_start_time" time without time zone, "new_end_time" time without time zone, "new_class_group" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_settings"("settings_data" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  rec record;
BEGIN
  -- Keamanan: Hanya Admin yang boleh mengubah pengaturan
  IF (SELECT public.get_user_role(auth.uid())) NOT IN ('Admin', 'Super Admin') THEN
    RAISE EXCEPTION 'Hanya admin yang boleh mengubah pengaturan.';
  END IF;

  -- Looping melalui setiap key-value di JSON dan update tabel
  FOR rec IN SELECT * FROM jsonb_each_text(settings_data)
  LOOP
    UPDATE public.settings
    SET value = rec.value, updated_at = now()
    WHERE id = rec.key;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."update_settings"("settings_data" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_profile"("user_id" "uuid", "new_full_name" "text", "new_role" "public"."user_role") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Cek dulu apakah yang menjalankan adalah admin
  IF (SELECT public.get_user_role(auth.uid())) NOT IN ('Admin', 'Super Admin') THEN
    RAISE EXCEPTION 'Hanya admin yang boleh mengubah data pengguna.';
  END IF;

  UPDATE public.profiles
  SET
    full_name = new_full_name,
    role = new_role
  WHERE
    id = user_id;
END;
$$;


ALTER FUNCTION "public"."update_user_profile"("user_id" "uuid", "new_full_name" "text", "new_role" "public"."user_role") OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."activity_log" (
    "id" bigint NOT NULL,
    "user_id" "uuid",
    "action_type" "text" NOT NULL,
    "details" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."activity_log" OWNER TO "postgres";


COMMENT ON TABLE "public"."activity_log" IS 'Mencatat semua aktivitas penting pengguna dan sistem.';



ALTER TABLE "public"."activity_log" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."activity_log_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."announcements" (
    "id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "content" "text",
    "creator_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."announcements" OWNER TO "postgres";


COMMENT ON TABLE "public"."announcements" IS 'Menyimpan daftar pengumuman untuk ditampilkan kepada pengguna.';



ALTER TABLE "public"."announcements" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."announcements_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."assignments" (
    "id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "course_id" bigint,
    "due_date" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "description" "text",
    "type" "public"."assignment_type" DEFAULT 'Tugas'::"public"."assignment_type" NOT NULL,
    "creator_id" "uuid"
);


ALTER TABLE "public"."assignments" OWNER TO "postgres";


COMMENT ON TABLE "public"."assignments" IS 'Menyimpan daftar tugas dan ujian.';



COMMENT ON COLUMN "public"."assignments"."description" IS 'Instruksi atau deskripsi detail untuk tugas/ujian.';



COMMENT ON COLUMN "public"."assignments"."type" IS 'Membedakan antara Tugas biasa atau Ujian.';



COMMENT ON COLUMN "public"."assignments"."creator_id" IS 'ID pengguna (guru/admin) yang membuat tugas.';



ALTER TABLE "public"."assignments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."assignments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."courses" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "teacher_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "description" "text"
);


ALTER TABLE "public"."courses" OWNER TO "postgres";


COMMENT ON TABLE "public"."courses" IS 'Menyimpan daftar mata pelajaran atau kelas.';



COMMENT ON COLUMN "public"."courses"."description" IS 'Deskripsi singkat tentang mata pelajaran.';



ALTER TABLE "public"."courses" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."courses_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."materials" (
    "id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "course_id" bigint,
    "uploader_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "type" "public"."material_type" DEFAULT 'text'::"public"."material_type" NOT NULL,
    "content" "text"
);


ALTER TABLE "public"."materials" OWNER TO "postgres";


COMMENT ON TABLE "public"."materials" IS 'Menyimpan materi pembelajaran untuk setiap mata pelajaran.';



COMMENT ON COLUMN "public"."materials"."type" IS 'Jenis materi: file, link, atau text.';



COMMENT ON COLUMN "public"."materials"."content" IS 'Isi materi: URL untuk file/link, atau teks mentah.';



ALTER TABLE "public"."materials" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."materials_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" "text",
    "role" "public"."user_role",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


COMMENT ON TABLE "public"."profiles" IS 'Menyimpan data profil publik untuk setiap pengguna.';



COMMENT ON COLUMN "public"."profiles"."id" IS 'Referensi ke auth.users.id, sebagai Kunci Utama dan Kunci Asing.';



CREATE TABLE IF NOT EXISTS "public"."schedules" (
    "id" bigint NOT NULL,
    "course_id" bigint,
    "day_of_week" "public"."day_of_week_enum" NOT NULL,
    "start_time" time without time zone NOT NULL,
    "end_time" time without time zone NOT NULL,
    "class_group" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."schedules" OWNER TO "postgres";


COMMENT ON TABLE "public"."schedules" IS 'Menyimpan jadwal pelajaran mingguan.';



ALTER TABLE "public"."schedules" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."schedules_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."activity_log"
    ADD CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."announcements"
    ADD CONSTRAINT "announcements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assignments"
    ADD CONSTRAINT "assignments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."materials"
    ADD CONSTRAINT "materials_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schedules"
    ADD CONSTRAINT "schedules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."activity_log"
    ADD CONSTRAINT "activity_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."announcements"
    ADD CONSTRAINT "announcements_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."assignments"
    ADD CONSTRAINT "assignments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assignments"
    ADD CONSTRAINT "assignments_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."materials"
    ADD CONSTRAINT "materials_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."materials"
    ADD CONSTRAINT "materials_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schedules"
    ADD CONSTRAINT "schedules_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;



CREATE POLICY "Admins and teachers can create assignments." ON "public"."assignments" FOR INSERT WITH CHECK ((( SELECT "public"."get_user_role"("auth"."uid"()) AS "get_user_role") = ANY (ARRAY['Admin'::"text", 'Super Admin'::"text", 'Guru Mapel'::"text", 'Guru BK'::"text", 'Wali Kelas'::"text"])));



CREATE POLICY "Admins and teachers can create materials." ON "public"."materials" FOR INSERT WITH CHECK ((( SELECT "public"."get_user_role"("auth"."uid"()) AS "get_user_role") = ANY (ARRAY['Admin'::"text", 'Super Admin'::"text", 'Guru Mapel'::"text", 'Guru BK'::"text", 'Wali Kelas'::"text"])));



COMMENT ON POLICY "Admins and teachers can create materials." ON "public"."materials" IS 'Hanya admin dan guru yang boleh menambahkan materi baru.';



CREATE POLICY "Admins can create announcements." ON "public"."announcements" FOR INSERT WITH CHECK ((( SELECT "public"."get_user_role"("auth"."uid"()) AS "get_user_role") = ANY (ARRAY['Admin'::"text", 'Super Admin'::"text"])));



CREATE POLICY "Admins can create schedules." ON "public"."schedules" FOR INSERT WITH CHECK ((( SELECT "public"."get_user_role"("auth"."uid"()) AS "get_user_role") = ANY (ARRAY['Admin'::"text", 'Super Admin'::"text"])));



CREATE POLICY "Admins can delete announcements." ON "public"."announcements" FOR DELETE USING ((( SELECT "public"."get_user_role"("auth"."uid"()) AS "get_user_role") = ANY (ARRAY['Admin'::"text", 'Super Admin'::"text"])));



CREATE POLICY "Admins can delete schedules." ON "public"."schedules" FOR DELETE USING ((( SELECT "public"."get_user_role"("auth"."uid"()) AS "get_user_role") = ANY (ARRAY['Admin'::"text", 'Super Admin'::"text"])));



CREATE POLICY "Admins can update announcements." ON "public"."announcements" FOR UPDATE USING ((( SELECT "public"."get_user_role"("auth"."uid"()) AS "get_user_role") = ANY (ARRAY['Admin'::"text", 'Super Admin'::"text"])));



CREATE POLICY "Admins can update schedules." ON "public"."schedules" FOR UPDATE USING ((( SELECT "public"."get_user_role"("auth"."uid"()) AS "get_user_role") = ANY (ARRAY['Admin'::"text", 'Super Admin'::"text"])));



CREATE POLICY "Admins can update settings." ON "public"."settings" FOR UPDATE USING ((( SELECT "public"."get_user_role"("auth"."uid"()) AS "get_user_role") = ANY (ARRAY['Admin'::"text", 'Super Admin'::"text"])));



CREATE POLICY "Authenticated users can insert their own activity" ON "public"."activity_log" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



COMMENT ON POLICY "Authenticated users can insert their own activity" ON "public"."activity_log" IS 'Pengguna hanya bisa membuat log untuk dirinya sendiri.';



CREATE POLICY "Authenticated users can view announcements." ON "public"."announcements" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can view assignments." ON "public"."assignments" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can view courses." ON "public"."courses" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can view materials." ON "public"."materials" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can view schedules." ON "public"."schedules" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can view settings." ON "public"."settings" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Users can update their own profile." ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can view profiles." ON "public"."profiles" FOR SELECT USING ((("auth"."uid"() = "id") OR (( SELECT "public"."get_user_role"("auth"."uid"()) AS "get_user_role") = ANY (ARRAY['Admin'::"text", 'Super Admin'::"text"]))));



ALTER TABLE "public"."announcements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."assignments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."courses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."materials" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schedules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."settings" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."create_announcement"("title" "text", "content" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_announcement"("title" "text", "content" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_announcement"("title" "text", "content" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_assignment"("title" "text", "description" "text", "type" "public"."assignment_type", "course_id" bigint, "due_date" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."create_assignment"("title" "text", "description" "text", "type" "public"."assignment_type", "course_id" bigint, "due_date" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_assignment"("title" "text", "description" "text", "type" "public"."assignment_type", "course_id" bigint, "due_date" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."create_course"("name" "text", "description" "text", "teacher_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_course"("name" "text", "description" "text", "teacher_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_course"("name" "text", "description" "text", "teacher_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_material"("title" "text", "course_id" bigint, "type" "public"."material_type", "content" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_material"("title" "text", "course_id" bigint, "type" "public"."material_type", "content" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_material"("title" "text", "course_id" bigint, "type" "public"."material_type", "content" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_schedule_entry"("course_id" bigint, "day_of_week" "public"."day_of_week_enum", "start_time" time without time zone, "end_time" time without time zone, "class_group" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_schedule_entry"("course_id" bigint, "day_of_week" "public"."day_of_week_enum", "start_time" time without time zone, "end_time" time without time zone, "class_group" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_schedule_entry"("course_id" bigint, "day_of_week" "public"."day_of_week_enum", "start_time" time without time zone, "end_time" time without time zone, "class_group" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_user_sync_trigger"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_user_sync_trigger"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_user_sync_trigger"() TO "service_role";



GRANT ALL ON FUNCTION "public"."delete_announcement"("announcement_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."delete_announcement"("announcement_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_announcement"("announcement_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."delete_assignment"("assignment_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."delete_assignment"("assignment_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_assignment"("assignment_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."delete_course"("course_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."delete_course"("course_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_course"("course_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."delete_schedule_entry"("schedule_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."delete_schedule_entry"("schedule_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_schedule_entry"("schedule_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_announcements_with_details"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_announcements_with_details"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_announcements_with_details"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_assignments_with_details"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_assignments_with_details"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_assignments_with_details"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_courses"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_courses"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_courses"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_courses_with_details"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_courses_with_details"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_courses_with_details"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_materials_with_details"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_materials_with_details"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_materials_with_details"() TO "service_role";



GRANT ALL ON TABLE "public"."settings" TO "anon";
GRANT ALL ON TABLE "public"."settings" TO "authenticated";
GRANT ALL ON TABLE "public"."settings" TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_settings"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_settings"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_settings"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_teachers"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_teachers"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_teachers"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_users_with_details"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_users_with_details"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_users_with_details"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_announcement_by_id"("announcement_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_announcement_by_id"("announcement_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_announcement_by_id"("announcement_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_assignment_details_by_id"("assignment_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_assignment_details_by_id"("assignment_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_assignment_details_by_id"("assignment_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_course_details_by_id"("course_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_course_details_by_id"("course_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_course_details_by_id"("course_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_current_user_profile"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_current_user_profile"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_current_user_profile"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_dashboard_stats"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_dashboard_stats"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_dashboard_stats"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_full_schedule"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_full_schedule"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_full_schedule"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_latest_activity_logs"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_latest_activity_logs"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_latest_activity_logs"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_latest_assignments"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_latest_assignments"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_latest_assignments"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_material_details_by_id"("material_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_material_details_by_id"("material_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_material_details_by_id"("material_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_paginated_activity_logs"("page_size" integer, "page_number" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_paginated_activity_logs"("page_size" integer, "page_number" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_paginated_activity_logs"("page_size" integer, "page_number" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_paginated_assignments"("page_size" integer, "page_number" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_paginated_assignments"("page_size" integer, "page_number" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_paginated_assignments"("page_size" integer, "page_number" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_paginated_assignments"("page_size" integer, "page_number" integer, "show_expired" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."get_paginated_assignments"("page_size" integer, "page_number" integer, "show_expired" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_paginated_assignments"("page_size" integer, "page_number" integer, "show_expired" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_paginated_courses"("page_size" integer, "page_number" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_paginated_courses"("page_size" integer, "page_number" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_paginated_courses"("page_size" integer, "page_number" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_paginated_materials"("page_size" integer, "page_number" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_paginated_materials"("page_size" integer, "page_number" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_paginated_materials"("page_size" integer, "page_number" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_paginated_users"("page_size" integer, "page_number" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_paginated_users"("page_size" integer, "page_number" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_paginated_users"("page_size" integer, "page_number" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_schedule_details_by_id"("schedule_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_schedule_details_by_id"("schedule_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_schedule_details_by_id"("schedule_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_details_by_id"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_details_by_id"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_details_by_id"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_role"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_role"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_role"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_weekly_activity"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_weekly_activity"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_weekly_activity"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_announcement"("announcement_id" bigint, "new_title" "text", "new_content" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_announcement"("announcement_id" bigint, "new_title" "text", "new_content" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_announcement"("announcement_id" bigint, "new_title" "text", "new_content" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_assignment"("assignment_id" bigint, "new_title" "text", "new_description" "text", "new_type" "public"."assignment_type", "new_course_id" bigint, "new_due_date" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."update_assignment"("assignment_id" bigint, "new_title" "text", "new_description" "text", "new_type" "public"."assignment_type", "new_course_id" bigint, "new_due_date" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_assignment"("assignment_id" bigint, "new_title" "text", "new_description" "text", "new_type" "public"."assignment_type", "new_course_id" bigint, "new_due_date" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."update_course"("course_id" bigint, "new_name" "text", "new_description" "text", "new_teacher_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."update_course"("course_id" bigint, "new_name" "text", "new_description" "text", "new_teacher_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_course"("course_id" bigint, "new_name" "text", "new_description" "text", "new_teacher_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_material_details"("material_id" bigint, "new_title" "text", "new_course_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."update_material_details"("material_id" bigint, "new_title" "text", "new_course_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_material_details"("material_id" bigint, "new_title" "text", "new_course_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."update_schedule_entry"("schedule_id" bigint, "new_course_id" bigint, "new_day_of_week" "public"."day_of_week_enum", "new_start_time" time without time zone, "new_end_time" time without time zone, "new_class_group" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_schedule_entry"("schedule_id" bigint, "new_course_id" bigint, "new_day_of_week" "public"."day_of_week_enum", "new_start_time" time without time zone, "new_end_time" time without time zone, "new_class_group" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_schedule_entry"("schedule_id" bigint, "new_course_id" bigint, "new_day_of_week" "public"."day_of_week_enum", "new_start_time" time without time zone, "new_end_time" time without time zone, "new_class_group" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_settings"("settings_data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."update_settings"("settings_data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_settings"("settings_data" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_profile"("user_id" "uuid", "new_full_name" "text", "new_role" "public"."user_role") TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_profile"("user_id" "uuid", "new_full_name" "text", "new_role" "public"."user_role") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_profile"("user_id" "uuid", "new_full_name" "text", "new_role" "public"."user_role") TO "service_role";


















GRANT ALL ON TABLE "public"."activity_log" TO "anon";
GRANT ALL ON TABLE "public"."activity_log" TO "authenticated";
GRANT ALL ON TABLE "public"."activity_log" TO "service_role";



GRANT ALL ON SEQUENCE "public"."activity_log_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."activity_log_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."activity_log_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."announcements" TO "anon";
GRANT ALL ON TABLE "public"."announcements" TO "authenticated";
GRANT ALL ON TABLE "public"."announcements" TO "service_role";



GRANT ALL ON SEQUENCE "public"."announcements_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."announcements_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."announcements_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."assignments" TO "anon";
GRANT ALL ON TABLE "public"."assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."assignments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."assignments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."assignments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."assignments_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."courses" TO "anon";
GRANT ALL ON TABLE "public"."courses" TO "authenticated";
GRANT ALL ON TABLE "public"."courses" TO "service_role";



GRANT ALL ON SEQUENCE "public"."courses_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."courses_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."courses_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."materials" TO "anon";
GRANT ALL ON TABLE "public"."materials" TO "authenticated";
GRANT ALL ON TABLE "public"."materials" TO "service_role";



GRANT ALL ON SEQUENCE "public"."materials_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."materials_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."materials_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."schedules" TO "anon";
GRANT ALL ON TABLE "public"."schedules" TO "authenticated";
GRANT ALL ON TABLE "public"."schedules" TO "service_role";



GRANT ALL ON SEQUENCE "public"."schedules_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."schedules_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."schedules_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
