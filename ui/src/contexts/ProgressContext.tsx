import React, { createContext, useContext, useState, useEffect } from 'react';

interface Progress {
  pathId: string;
  completedLessons: string[];
  completedTasks: string[];
  currentLesson?: string;
  score: number;
}

interface ProgressContextType {
  progress: Progress[];
  updateProgress: (pathId: string, lessonId?: string, taskId?: string, score?: number) => void;
  getPathProgress: (pathId: string) => Progress | undefined;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<Progress[]>([]);

  useEffect(() => {
    const savedProgress = localStorage.getItem('userProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  const updateProgress = (pathId: string, lessonId?: string, taskId?: string, score?: number) => {
    setProgress(prev => {
      const existingIndex = prev.findIndex(p => p.pathId === pathId);
      let updatedProgress: Progress[];

      if (existingIndex >= 0) {
        updatedProgress = [...prev];
        if (lessonId && !updatedProgress[existingIndex].completedLessons.includes(lessonId)) {
          updatedProgress[existingIndex].completedLessons.push(lessonId);
        }
        if (taskId && !updatedProgress[existingIndex].completedTasks.includes(taskId)) {
          updatedProgress[existingIndex].completedTasks.push(taskId);
        }
        if (score !== undefined) {
          updatedProgress[existingIndex].score += score;
        }
        if (lessonId) {
          updatedProgress[existingIndex].currentLesson = lessonId;
        }
      } else {
        const newProgress: Progress = {
          pathId,
          completedLessons: lessonId ? [lessonId] : [],
          completedTasks: taskId ? [taskId] : [],
          currentLesson: lessonId,
          score: score || 0
        };
        updatedProgress = [...prev, newProgress];
      }

      localStorage.setItem('userProgress', JSON.stringify(updatedProgress));
      return updatedProgress;
    });
  };

  const getPathProgress = (pathId: string) => {
    return progress.find(p => p.pathId === pathId);
  };

  return (
    <ProgressContext.Provider value={{ progress, updateProgress, getPathProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};