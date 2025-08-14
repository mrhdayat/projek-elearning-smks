// src/components/ContactSection.jsx
import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

function ContactSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Kontak Kami</h2>
        </div>
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Kolom Kiri: Form */}
          <div className="lg:w-2/3 bg-gray-50 p-8 rounded-lg">
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Nama</label>
                  <input type="text" id="name" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Nama Anda" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input type="email" id="email" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="email@contoh.com" />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Pesan</label>
                <textarea id="message" rows="5" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Tuliskan pesan Anda..."></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
                Kirim Pesan
              </button>
            </form>
          </div>

          {/* Kolom Kanan: Info Kontak */}
          <div className="lg:w-1/3">
            <div className="flex items-start mb-6">
              <FaMapMarkerAlt className="text-blue-600 mt-1 mr-4" size={20} />
              <div>
                <h4 className="font-bold">Alamat</h4>
                <p className="text-gray-600">Jl. Transmigrasi Poros, Satui, Tanah Bumbu, Kalimantan Selatan</p>
              </div>
            </div>
            <div className="flex items-start mb-6">
              <FaEnvelope className="text-blue-600 mt-1 mr-4" size={20} />
              <div>
                <h4 className="font-bold">Email</h4>
                <p className="text-gray-600">kontak@smksmuhammadiyahsatui.sch.id</p>
              </div>
            </div>
            <div className="flex items-start">
              <FaPhoneAlt className="text-blue-600 mt-1 mr-4" size={20} />
              <div>
                <h4 className="font-bold">Telepon</h4>
                <p className="text-gray-600">(0512) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;