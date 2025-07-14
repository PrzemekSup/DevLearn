import { BookOpen, CheckCircle2, Target, Trophy } from "lucide-react";
import { StatCard } from "../../../components/common/StatCard";

type StatsCardsProps = {
  coursesEnrolled: number;
  lessonsCompleted: number;
  currentStreak: number;
  totalXP: number;
};
export const StatsCards = ({
  coursesEnrolled,
  lessonsCompleted,
  currentStreak,
  totalXP,
}: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={BookOpen}
        title="Liczba kursów"
        value={coursesEnrolled}
        color="blue"
      />
      <StatCard
        icon={CheckCircle2}
        title="Zaliczonych lekcji"
        value={lessonsCompleted}
        color="green"
      />
      <StatCard
        icon={Target}
        title="Dzienna seria"
        value={currentStreak}
        color="orange"
      />
      <StatCard
        icon={Trophy}
        title="Łączna liczba punktów"
        value={totalXP}
        color="purple"
      />
    </div>
  );
};
