"use client"

import { useEffect, useState, useRef } from "react"
import { Search, X, BookmarkPlus, BookmarkCheck, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const games = [
  { id: 1, name: "VALORANT", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%20de%202024-10-11%2013.20.51-bMMunzgAfQ65qtXFKlzeK8I6X6vJeF.png" },
  { id: 2, name: "League of Legends", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%20de%202024-10-11%2013.20.51-bMMunzgAfQ65qtXFKlzeK8I6X6vJeF.png" },
  { id: 3, name: "Rocket League", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%20de%202024-10-11%2013.20.51-bMMunzgAfQ65qtXFKlzeK8I6X6vJeF.png" },
  { id: 4, name: "Pokémon TCG", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%20de%202024-10-11%2013.20.51-bMMunzgAfQ65qtXFKlzeK8I6X6vJeF.png" },
  { id: 5, name: "Super Smash Bros. Ultimate", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%20de%202024-10-11%2013.20.51-bMMunzgAfQ65qtXFKlzeK8I6X6vJeF.png" },
]

const subcategories = {
  "League of Legends": ["All", "Top", "Jungle", "Mid", "ADC", "Support"],
  "VALORANT": ["All", "Duelists", "Initiators", "Controllers", "Sentinels"],
  // Add subcategories for other games...
}

export default function GamingCoursesDirectory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGame, setSelectedGame] = useState(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState("All")
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [filteredCourses, setFilteredCourses] = useState([])
  const [savedCourses, setSavedCourses] = useState([])
  const [courses, setCourses] = useState([])
  const courseDetailRef = useRef(null)

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesCollection = collection(db, 'courses');
      const coursesSnapshot = await getDocs(coursesCollection);
      const coursesList = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(coursesList);
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course => 
      (selectedGame ? course.game === selectedGame.name : true) &&
      (selectedSubcategory === "All" || course.subcategory === selectedSubcategory) &&
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCourses(filtered)
  }, [searchTerm, selectedGame, selectedSubcategory, courses])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (courseDetailRef.current && !courseDetailRef.current.contains(event.target)) {
        setSelectedCourse(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleSavedCourse = (courseId) => {
    setSavedCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    )
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <header className="bg-gradient-to-r from-purple-900 to-indigo-900 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%20de%202024-10-11%2013.20.51-bMMunzgAfQ65qtXFKlzeK8I6X6vJeF.png" alt="Logo" className="h-10 w-10 mr-4" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Gaming Courses</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-600">Discover Top Gaming Courses</h2>

        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl relative">
            <Input
              type="text"
              placeholder="Search for a course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 bg-opacity-50 border-gray-700 focus:border-purple-500 focus:ring-purple-500 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-600">Games</h3>
            <Select onValueChange={(value) => setSelectedGame(games.find(game => game.name === value))}>
              <SelectTrigger className="w-[180px] bg-gray-800 bg-opacity-50 border-gray-700">
                <SelectValue placeholder="More games" />
              </SelectTrigger>
              <SelectContent className="bg-black border-gray-700">
                {games.map(game => (
                  <SelectItem key={game.id} value={game.name} className="text-white hover:bg-gray-800">{game.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-4 pb-4">
              {games.map(game => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(selectedGame?.id === game.id ? null : game)}
                  className={`flex-shrink-0 w-40 h-60 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedGame?.id === game.id ? 'border-purple-500 scale-105' : 'border-transparent'
                  }`}
                >
                  <div className="w-full h-full bg-gradient-to-b from-transparent to-purple-900 relative">
                    <img src={game.image} alt={game.name} className="w-full h-full object-cover mix-blend-overlay" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50">
                      <p className="text-sm font-semibold">{game.name}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {selectedGame && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-600">Top Courses for {selectedGame.name}</h3>
              <Select onValueChange={setSelectedSubcategory}>
                <SelectTrigger className="w-[180px] bg-gray-800 bg-opacity-50 border-gray-700">
                  <SelectValue placeholder="Subcategory" />
                </SelectTrigger>
                <SelectContent className="bg-black border-gray-700">
                  {subcategories[selectedGame.name].map(subcat => (
                    <SelectItem key={subcat} value={subcat} className="text-white hover:bg-gray-800">{subcat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {filteredCourses.length > 0 && (
              <div className="grid grid-cols-1 gap-6 mb-8">
                <div className="bg-gray-800 bg-opacity-50 rounded-lg shadow-md overflow-hidden">
                  <div className="md:flex">
                    <div className="md:flex-shrink-0">
                      <img className="h-48 w-full object-cover md:w-48" src={filteredCourses[0].image} alt={filteredCourses[0].title} />
                    </div>
                    <div className="p-8">
                      <div className="uppercase tracking-wide text-sm text-purple-500 font-semibold">{filteredCourses[0].game}</div>
                      <a href="#" className="block mt-1 text-lg leading-tight font-medium text-white hover:underline">{filteredCourses[0].title}</a>
                      <p className="mt-2 text-gray-300">{filteredCourses[0].brief}</p>
                      <div className="mt-4 flex items-center">
                        <img className="h-10 w-10 rounded-full mr-2" src={filteredCourses[0].instructor.image} alt={filteredCourses[0].instructor.name} />
                        <div>
                          <p className="text-sm font-semibold text-gray-200">{filteredCourses[0].instructor.name}</p>
                          <p className="text-sm text-gray-400">{filteredCourses[0].duration} • {filteredCourses[0].price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.slice(1).map(course => (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className="bg-gray-800 bg-opacity-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                >
                  
                  <div className="relative">
                    <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-lg font-semibold">View Details</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">{course.title}</h3>
                    <p className="text-sm text-gray-300 mb-2">{course.brief}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">{course.duration}</span>
                      <span className="text-sm font-semibold text-purple-400">{course.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!selectedGame && (
          <div className="text-center text-gray-400">
            <p>Select a game to view its courses</p>
          </div>
        )}
      </main>

      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-stretch z-50 backdrop-blur-sm">
          <div
            ref={courseDetailRef}
            className="w-full md:w-2/3 lg:w-1/2 bg-black shadow-lg overflow-y-auto animate-slide-in"
          >
            <div className="p-6 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={() => setSelectedCourse(null)}
              >
                <X className="h-6 w-6" />
              </Button>
              <img src={selectedCourse.image} alt={selectedCourse.title} className="w-full h-64 object-cover rounded-lg mb-6" />
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-600">{selectedCourse.title}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleSavedCourse(selectedCourse.id)}
                  className="text-purple-400 hover:text-white hover:bg-purple-600"
                >
                  {savedCourses.includes(selectedCourse.id) ? (
                    <BookmarkCheck className="h-5 w-5" />
                  ) : (
                    <BookmarkPlus className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className="text-gray-300 mb-6">{selectedCourse.description}</p>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-600">Chapters</h3>
                <ul className="list-disc list-inside text-gray-300">
                  {selectedCourse.chapters.map((chapter, index) => (
                    <li key={index}>{chapter}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-600">Instructor</h3>
                <div className="flex items-start">
                  <img src={selectedCourse.instructor.image} alt={selectedCourse.instructor.name} className="w-16 h-16 rounded-full mr-4" />
                  <div>
                    <h4 className="font-semibold text-lg">{selectedCourse.instructor.name}</h4>
                    <p className="text-gray-300">{selectedCourse.instructor.description}</p>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                Enroll Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}