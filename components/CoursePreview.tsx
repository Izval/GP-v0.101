import React from 'react';
import { Clock, BookmarkPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";

const CoursePreview = ({ course }) => {
  return (
    <div className="bg-black shadow-lg rounded-lg overflow-hidden">
      <img 
        src={course.image || 'https://via.placeholder.com/400x200'} 
        alt={course.title} 
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-600">
            {course.title}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="text-purple-400 hover:text-white hover:bg-purple-600"
          >
            <BookmarkPlus className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-gray-300 mb-6">{course.description}</p>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-600">
            Chapters
          </h3>
          <ul className="list-disc list-inside text-gray-300">
            {course.chapters.map((chapter, index) => (
              <li key={index}>{chapter.title}</li>
            ))}
          </ul>
        </div>
        {course.instructor && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-600">
              Instructor
            </h3>
            <div className="flex items-start">
              <img 
                src={course.instructor.image || 'https://via.placeholder.com/64'} 
                alt={course.instructor.name} 
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h4 className="font-semibold text-lg">{course.instructor.name}</h4>
                <p className="text-gray-300">{course.instructor.description}</p>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {course.duration}
          </span>
          <span>{course.language}</span>
        </div>
        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
          Enroll Now
        </Button>
      </div>
    </div>
  );
};

export default CoursePreview;