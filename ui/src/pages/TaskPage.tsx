import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import Editor from '@monaco-editor/react';
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  Code2,
  Terminal,
  RefreshCw,
  Lightbulb,
  Award
} from 'lucide-react';

interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  language: 'javascript' | 'csharp';
  starterCode: string;
  solution: string;
  testCases: TestCase[];
  hints: string[];
  pathId: string;
  lessonId?: string;
}

const TaskPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { user } = useAuth();
  const { updateProgress } = useProgress();
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  // Mock task data
  const task: Task = {
    id: taskId || '1',
    title: 'Build a Counter Component',
    description: `Create a React component that displays a counter with increment and decrement buttons.

**Requirements:**
- Display the current count (starting at 0)
- Include a button to increment the count
- Include a button to decrement the count
- The count should never go below 0
- Style the component to look professional

**Bonus:**
- Add a reset button to set the count back to 0
- Add keyboard shortcuts (+ and - keys)`,
    difficulty: 'Easy',
    language: 'javascript',
    pathId: 'react-fundamentals',
    lessonId: '1',
    starterCode: `import React, { useState } from 'react';

function Counter() {
  // Your code here
  
  return (
    <div>
      {/* Your JSX here */}
    </div>
  );
}

export default Counter;`,
    solution: `import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => Math.max(0, prev - 1));
  const reset = () => setCount(0);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '+') increment();
      if (e.key === '-') decrement();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2>Counter: {count}</h2>
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={decrement}
          style={{
            margin: '0 10px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          -
        </button>
        <button 
          onClick={increment}
          style={{
            margin: '0 10px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          +
        </button>
        <button 
          onClick={reset}
          style={{
            margin: '0 10px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Counter;`,
    testCases: [
      {
        input: 'Initial render',
        expectedOutput: 'Counter displays 0',
        description: 'Component should display initial count of 0'
      },
      {
        input: 'Click increment button',
        expectedOutput: 'Counter displays 1',
        description: 'Clicking increment should increase count by 1'
      },
      {
        input: 'Click decrement button when count is 0',
        expectedOutput: 'Counter displays 0',
        description: 'Count should not go below 0'
      }
    ],
    hints: [
      'Use the useState hook to manage the counter state',
      'Create functions for increment and decrement operations',
      'Use Math.max(0, count - 1) to prevent negative numbers',
      'Add event listeners for keyboard shortcuts using useEffect',
      'Style your component using inline styles or CSS classes'
    ]
  };

  useEffect(() => {
    setCode(task.starterCode);
  }, [task.starterCode]);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    setTestResults([]);

    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock test results
      const results = task.testCases.map((testCase, index) => {
        // Simple validation - in a real app, this would execute the code
        const passed = code.includes('useState') && 
                      code.includes('increment') && 
                      code.includes('decrement') &&
                      code.length > task.starterCode.length;
        
        return {
          passed,
          message: passed ? `✓ ${testCase.description}` : `✗ ${testCase.description}`
        };
      });

      setTestResults(results);
      
      const allPassed = results.every(result => result.passed);
      if (allPassed && !isCompleted) {
        setIsCompleted(true);
        if (user) {
          updateProgress(task.pathId, undefined, task.id, 50);
        }
        setOutput('🎉 All tests passed! Great job!');
      } else {
        setOutput('Some tests failed. Check the requirements and try again.');
      }
    } catch (error) {
      setOutput('Error running code: ' + error);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(task.starterCode);
    setOutput('');
    setTestResults([]);
    setIsCompleted(false);
  };

  const showNextHint = () => {
    if (currentHint < task.hints.length - 1) {
      setCurrentHint(prev => prev + 1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to={task.lessonId ? `/lesson/${task.lessonId}` : `/course/${task.pathId}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mr-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {task.lessonId ? 'Lesson' : 'Course'}
              </Link>
              <div>
                <div className="flex items-center mb-1">
                  <h1 className="text-xl font-semibold text-gray-900 mr-3">{task.title}</h1>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(task.difficulty)}`}>
                    {task.difficulty}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Code2 className="h-4 w-4 mr-1" />
                  <span className="capitalize">{task.language}</span>
                  {isCompleted && (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500 ml-4 mr-1" />
                      <span className="text-green-600">Completed</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowHints(!showHints)}
                className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
              >
                <Lightbulb className="h-4 w-4 mr-2 inline" />
                Hints
              </button>
              <button
                onClick={resetCode}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2 inline" />
                Reset
              </button>
              <button
                onClick={runCode}
                disabled={isRunning}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Task Description */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Task Description</h2>
              <div className="prose prose-sm max-w-none">
                {task.description.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <h3 key={index} className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                        {paragraph.slice(2, -2)}
                      </h3>
                    );
                  } else if (paragraph.startsWith('- ')) {
                    return (
                      <li key={index} className="text-gray-700 ml-4">
                        {paragraph.slice(2)}
                      </li>
                    );
                  } else if (paragraph.trim()) {
                    return (
                      <p key={index} className="text-gray-700 mb-3">
                        {paragraph}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Test Cases */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Cases</h3>
              <div className="space-y-3">
                {task.testCases.map((testCase, index) => {
                  const result = testResults[index];
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        result
                          ? result.passed
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          Test {index + 1}
                        </span>
                        {result && (
                          result.passed ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{testCase.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hints */}
            {showHints && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Hints</h3>
                  <span className="text-sm text-gray-500">
                    {currentHint + 1} of {task.hints.length}
                  </span>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800">{task.hints[currentHint]}</p>
                </div>
                {currentHint < task.hints.length - 1 && (
                  <button
                    onClick={showNextHint}
                    className="w-full bg-yellow-100 text-yellow-700 py-2 rounded-lg hover:bg-yellow-200 transition-colors"
                  >
                    Show Next Hint
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Code Editor and Output */}
          <div className="lg:col-span-2 space-y-6">
            {/* Code Editor */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Code Editor</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 capitalize">{task.language}</span>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="h-96">
                <Editor
                  height="100%"
                  defaultLanguage={task.language === 'csharp' ? 'csharp' : 'javascript'}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>

            {/* Output */}
            <div className="bg-white rounded-2xl shadow-lg">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="flex items-center">
                  <Terminal className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Output</h3>
                </div>
              </div>
              <div className="p-6">
                {output ? (
                  <div className={`p-4 rounded-lg ${
                    isCompleted ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-800'
                  }`}>
                    <pre className="whitespace-pre-wrap font-mono text-sm">{output}</pre>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Terminal className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Click "Run Code" to see the output</p>
                  </div>
                )}

                {testResults.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold text-gray-900">Test Results:</h4>
                    {testResults.map((result, index) => (
                      <div
                        key={index}
                        className={`flex items-center p-2 rounded ${
                          result.passed ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
                        }`}
                      >
                        {result.passed ? (
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        <span className="text-sm">{result.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Success Message */}
            {isCompleted && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <Award className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Congratulations! 🎉</h3>
                    <p className="text-gray-600">You've successfully completed this task!</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowSolution(true)}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    View Solution
                  </button>
                  <Link
                    to={`/course/${task.pathId}`}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Continue Learning
                  </Link>
                </div>
              </div>
            )}

            {/* Solution Modal */}
            {showSolution && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">Solution</h3>
                      <button
                        onClick={() => setShowSolution(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="h-96 overflow-auto">
                    <Editor
                      height="100%"
                      defaultLanguage={task.language === 'csharp' ? 'csharp' : 'javascript'}
                      value={task.solution}
                      theme="vs-light"
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 14,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;