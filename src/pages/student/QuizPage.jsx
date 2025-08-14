// src/pages/student/QuizPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { LuClock, LuAlertCircle, LuCheckCircle, LuArrowLeft, LuArrowRight } from 'react-icons/lu';

function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        
        // Simulasi data kuis
        const mockQuiz = {
          id: quizId,
          title: "Quiz JavaScript Fundamentals",
          subject: "Pemrograman Web",
          teacher: "Pak Budi Santoso",
          description: "Kuis tentang konsep dasar JavaScript, variabel, function, dan DOM manipulation.",
          duration: 30, // dalam menit
          totalQuestions: 10,
          maxAttempts: 1,
          passingGrade: 70,
          instructions: [
            "Baca setiap pertanyaan dengan teliti",
            "Pilih jawaban yang paling tepat",
            "Anda tidak dapat kembali ke soal sebelumnya setelah melanjutkan",
            "Pastikan koneksi internet stabil",
            "Kuis akan otomatis selesai jika waktu habis"
          ],
          startTime: null,
          endTime: null,
          status: "available" // "available", "started", "finished", "expired"
        };

        // Simulasi data soal
        const mockQuestions = [
          {
            id: 1,
            type: "multiple_choice",
            question: "Apa yang dimaksud dengan JavaScript?",
            options: [
              "Bahasa pemrograman untuk styling web",
              "Bahasa pemrograman untuk membuat interaktivitas web",
              "Database management system",
              "Web server software"
            ],
            correctAnswer: 1,
            points: 10
          },
          {
            id: 2,
            type: "multiple_choice",
            question: "Manakah cara yang benar untuk mendeklarasikan variabel di JavaScript?",
            options: [
              "variable myVar = 5;",
              "var myVar = 5;",
              "declare myVar = 5;",
              "int myVar = 5;"
            ],
            correctAnswer: 1,
            points: 10
          },
          {
            id: 3,
            type: "multiple_choice",
            question: "Apa output dari console.log(typeof 'Hello World')?",
            options: [
              "string",
              "text",
              "char",
              "undefined"
            ],
            correctAnswer: 0,
            points: 10
          },
          {
            id: 4,
            type: "essay",
            question: "Jelaskan perbedaan antara let, const, dan var dalam JavaScript!",
            points: 20
          },
          {
            id: 5,
            type: "multiple_choice",
            question: "Bagaimana cara mengakses elemen HTML dengan ID 'myButton' menggunakan JavaScript?",
            options: [
              "document.getElement('myButton')",
              "document.getElementById('myButton')",
              "document.querySelector('#myButton')",
              "Jawaban B dan C benar"
            ],
            correctAnswer: 3,
            points: 15
          }
        ];

        setQuiz(mockQuiz);
        setQuestions(mockQuestions);
        setTimeLeft(mockQuiz.duration * 60); // convert to seconds
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId]);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (quizStarted && !quizFinished && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            handleSubmitQuiz(true); // auto submit when time's up
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, quizFinished, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setQuiz(prev => ({ ...prev, startTime: new Date().toISOString() }));
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async (autoSubmit = false) => {
    if (!autoSubmit) {
      const confirmSubmit = window.confirm(
        "Apakah Anda yakin ingin mengumpulkan kuis? Anda tidak dapat mengubah jawaban setelah dikumpulkan."
      );
      if (!confirmSubmit) return;
    }

    try {
      setSubmitting(true);
      
      // Simulasi submit quiz
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Calculate score
      let totalScore = 0;
      let correctAnswers = 0;
      
      questions.forEach(question => {
        if (question.type === 'multiple_choice') {
          const userAnswer = answers[question.id];
          if (userAnswer === question.correctAnswer) {
            totalScore += question.points;
            correctAnswers++;
          }
        } else if (question.type === 'essay') {
          // Essay questions need manual grading
          // For demo, give partial points
          if (answers[question.id] && answers[question.id].trim().length > 10) {
            totalScore += question.points * 0.8; // 80% for having an answer
          }
        }
      });

      const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
      const percentage = Math.round((totalScore / maxScore) * 100);

      setQuiz(prev => ({
        ...prev,
        endTime: new Date().toISOString(),
        status: 'finished',
        score: totalScore,
        maxScore: maxScore,
        percentage: percentage,
        correctAnswers: correctAnswers,
        totalQuestions: questions.filter(q => q.type === 'multiple_choice').length
      }));

      setQuizFinished(true);
      
      if (autoSubmit) {
        alert('Waktu habis! Kuis otomatis dikumpulkan.');
      } else {
        alert('Kuis berhasil dikumpulkan!');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Gagal mengumpulkan kuis. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat kuis...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Kuis tidak ditemukan</h3>
        <button
          onClick={() => navigate('/siswa/tugas')}
          className="text-blue-600 hover:text-blue-800"
        >
          Kembali ke daftar tugas
        </button>
      </div>
    );
  }

  // Quiz finished - show results
  if (quizFinished) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <LuCheckCircle className="text-green-500" size={64} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Kuis Selesai!</h1>
          <p className="text-gray-600">{quiz.title}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hasil Kuis</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{quiz.percentage}%</p>
              <p className="text-sm text-blue-800">Skor Akhir</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {quiz.correctAnswers}/{quiz.totalQuestions}
              </p>
              <p className="text-sm text-green-800">Jawaban Benar</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Skor:</span>
              <span className="font-medium">{quiz.score}/{quiz.maxScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Waktu Mulai:</span>
              <span className="font-medium">
                {new Date(quiz.startTime).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Waktu Selesai:</span>
              <span className="font-medium">
                {new Date(quiz.endTime).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${quiz.percentage >= quiz.passingGrade ? 'text-green-600' : 'text-red-600'}`}>
                {quiz.percentage >= quiz.passingGrade ? 'LULUS' : 'TIDAK LULUS'}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <button
              onClick={() => navigate('/siswa/tugas')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Kembali ke Daftar Tugas
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz not started - show instructions
  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/siswa/tugas')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <LuArrowLeft className="mr-2" size={20} />
            Kembali
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span>{quiz.subject}</span>
            <span>oleh {quiz.teacher}</span>
          </div>
          
          <p className="text-gray-700 mb-6">{quiz.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900">Durasi</h4>
              <p className="text-2xl font-bold text-blue-600">{quiz.duration} menit</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900">Jumlah Soal</h4>
              <p className="text-2xl font-bold text-green-600">{quiz.totalQuestions}</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Petunjuk Pengerjaan:</h4>
            <ul className="space-y-2">
              {quiz.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <LuAlertCircle className="text-yellow-600 mr-2" size={20} />
              <div>
                <h4 className="font-semibold text-yellow-800">Perhatian!</h4>
                <p className="text-sm text-yellow-700">
                  Setelah memulai kuis, timer akan berjalan dan tidak dapat dihentikan. 
                  Pastikan Anda siap sebelum memulai.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-semibold"
          >
            Mulai Kuis
          </button>
        </div>
      </div>
    );
  }

  // Quiz in progress
  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with timer */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-sm text-gray-600">
              Soal {currentQuestion + 1} dari {questions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center px-3 py-2 rounded-lg ${timeLeft <= 300 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
              <LuClock className="mr-2" size={16} />
              <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Soal {currentQuestion + 1}
            </h2>
            <span className="text-sm text-gray-600">
              {currentQ.points} poin
            </span>
          </div>
          <p className="text-gray-800 leading-relaxed">{currentQ.question}</p>
        </div>

        {/* Answer options */}
        <div className="space-y-3">
          {currentQ.type === 'multiple_choice' ? (
            currentQ.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  answers[currentQ.id] === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQ.id}`}
                  value={index}
                  checked={answers[currentQ.id] === index}
                  onChange={() => handleAnswerChange(currentQ.id, index)}
                  className="mr-3"
                />
                <span className="flex-1">{option}</span>
              </label>
            ))
          ) : (
            <textarea
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Ketik jawaban Anda di sini..."
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LuArrowLeft className="mr-2" size={16} />
          Sebelumnya
        </button>

        <div className="flex gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium ${
                index === currentQuestion
                  ? 'bg-blue-600 text-white'
                  : answers[questions[index].id] !== undefined
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={() => handleSubmitQuiz()}
            disabled={submitting}
            className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? 'Mengumpulkan...' : 'Selesai'}
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Selanjutnya
            <LuArrowRight className="ml-2" size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default QuizPage;
