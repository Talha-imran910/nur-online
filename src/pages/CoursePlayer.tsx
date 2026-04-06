import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { courses, sampleQuiz } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, PlayCircle, ChevronLeft, ChevronRight, HelpCircle, ArrowLeft } from "lucide-react";

export default function CoursePlayer() {
  const { courseId } = useParams();
  const course = courses.find((c) => c.id === courseId);
  const [currentLessonId, setCurrentLessonId] = useState(course?.units[0]?.lessons[0]?.id || "");
  const [completedLessons, setCompletedLessons] = useState<string[]>(
    course?.units[0]?.lessons.slice(0, 2).map((l) => l.id) || []
  );
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!course) return <div className="p-8 text-center font-serif text-2xl">Course not found</div>;

  const allLessons = course.units.flatMap((u) => u.lessons);
  const currentLesson = allLessons.find((l) => l.id === currentLessonId);
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);
  const totalLessons = allLessons.length;
  const progressPercent = (completedLessons.length / totalLessons) * 100;

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:v=|\/)([\w-]{11})/);
    return match ? match[1] : "";
  };

  const markComplete = () => {
    if (!completedLessons.includes(currentLessonId)) {
      setCompletedLessons((prev) => [...prev, currentLessonId]);
    }
    if (currentIndex < totalLessons - 1) {
      setCurrentLessonId(allLessons[currentIndex + 1].id);
      setShowQuiz(false);
      setQuizSubmitted(false);
      setQuizAnswers({});
    }
  };

  const quizScore = quizSubmitted
    ? sampleQuiz.questions.filter((q) => quizAnswers[q.id] === q.correctAnswer).length
    : 0;

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <div className="bg-navy-light border-b border-cream/10 px-4 py-3 flex items-center gap-4">
        <Link to={`/courses/${courseId}`} className="text-cream/70 hover:text-cream transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-cream text-sm font-medium truncate">{course.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Progress value={progressPercent} className="h-1.5 flex-1 max-w-xs bg-cream/10" />
            <span className="text-xs text-cream/50">{completedLessons.length}/{totalLessons}</span>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-cream/70 hover:text-cream p-2 lg:hidden">
          {sidebarOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto">
          {currentLesson && !showQuiz && (
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(currentLesson.youtubeUrl)}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={currentLesson.title}
              />
            </div>
          )}

          {showQuiz && (
            <div className="p-6 max-w-2xl mx-auto w-full animate-scale-in">
              <h2 className="font-serif text-2xl font-bold text-cream mb-6">{sampleQuiz.title}</h2>
              <div className="space-y-4">
                {sampleQuiz.questions.map((q, i) => (
                  <div key={q.id} className="bg-navy-light rounded-xl p-5 border border-cream/10">
                    <p className="text-cream font-medium mb-3">{i + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => {
                        const isSelected = quizAnswers[q.id] === oi;
                        const isCorrect = quizSubmitted && oi === q.correctAnswer;
                        const isWrong = quizSubmitted && isSelected && oi !== q.correctAnswer;
                        return (
                          <button key={oi} disabled={quizSubmitted}
                            onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                            className={`w-full text-left p-3 rounded-lg border transition-all duration-300 text-sm ${
                              isCorrect ? "border-emerald bg-emerald/10 text-emerald-light scale-[1.02]" :
                              isWrong ? "border-destructive bg-destructive/10 text-destructive" :
                              isSelected ? "border-gold bg-gold/10 text-gold" :
                              "border-cream/10 text-cream/70 hover:border-cream/30 hover:bg-cream/5"
                            }`}
                          >{opt}</button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {!quizSubmitted ? (
                <Button variant="hero" className="mt-6" onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(quizAnswers).length < sampleQuiz.questions.length}>
                  Submit Quiz
                </Button>
              ) : (
                <div className="mt-6 bg-navy-light rounded-xl p-5 border border-cream/10 animate-scale-in">
                  <p className="text-cream font-serif text-xl">Score: {quizScore}/{sampleQuiz.questions.length}</p>
                  <Button variant="heroOutline" className="mt-3" onClick={() => setShowQuiz(false)}>Back to Lesson</Button>
                </div>
              )}
            </div>
          )}

          {currentLesson && !showQuiz && (
            <div className="p-6 animate-fade-in">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-cream">{currentLesson.title}</h2>
                  <p className="text-cream/50 text-sm mt-1">Duration: {currentLesson.duration}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {currentLesson.hasQuiz && (
                    <Button variant="heroOutline" size="sm" onClick={() => setShowQuiz(true)}>
                      <HelpCircle className="mr-1 h-4 w-4" /> Take Quiz
                    </Button>
                  )}
                  <Button variant="hero" size="sm" onClick={markComplete}>
                    <CheckCircle className="mr-1 h-4 w-4" /> Complete & Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={`${sidebarOpen ? "w-80" : "w-0"} transition-all duration-300 overflow-hidden bg-navy-light border-l border-cream/10 flex-shrink-0`}>
          <div className="w-80 h-full overflow-y-auto">
            <div className="p-4">
              <h3 className="font-serif text-lg font-bold text-cream mb-4">Course Content</h3>
              {course.units.map((unit) => (
                <div key={unit.id} className="mb-4">
                  <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-2">{unit.title}</p>
                  {unit.lessons.map((lesson) => {
                    const isActive = lesson.id === currentLessonId;
                    const isCompleted = completedLessons.includes(lesson.id);
                    return (
                      <button key={lesson.id}
                        onClick={() => { setCurrentLessonId(lesson.id); setShowQuiz(false); setQuizSubmitted(false); setQuizAnswers({}); }}
                        className={`w-full text-left p-3 rounded-lg mb-1 flex items-center gap-3 transition-all duration-300 text-sm ${
                          isActive ? "bg-emerald/20 text-cream scale-[1.02]" : "text-cream/60 hover:bg-cream/5"
                        }`}
                      >
                        {isCompleted ? <CheckCircle className="h-4 w-4 text-emerald-light shrink-0" /> : <PlayCircle className="h-4 w-4 shrink-0" />}
                        <span className="truncate">{lesson.title}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
