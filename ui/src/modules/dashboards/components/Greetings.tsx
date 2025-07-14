interface GreetingsProps {
  user: {
    name: string;
  };
}

export const Greetings = ({ user }: GreetingsProps) => {
  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Dzień dobry";
    if (hour < 17) return "Dzień dobry";
    return "Dobry wieczór";
  };

  return (
    <>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {getTimeOfDayGreeting()}, {user.name}! 👋
        </h1>
        <p className="text-lg text-gray-600">
          Gotowy/a, aby kontynuować swoją naukową podróż?
        </p>
      </div>
    </>
  );
};
