import { useNavigate } from "react-router-dom";

interface Card {
  title: string;
  img: string;
  link: string;
}

const cards: Card[] = [
  {
    title: "indulge in some trivia",
    img: "/assets/icons/boipoka/Layer_1.svg",
    link: "/insomnia",
  },
  {
    title: "puzzle time?",
    img: "/assets/icons/boipoka/Isolation_Mode (1).svg",
    link: "/puzzle",
  },
  {
    title: "whats new in the book world",
    img: "/assets/icons/boipoka/Isolation_Mode.svg",
    link: "/whats-new",
  },
  {
    title: "weekly recommendation",
    img: "/assets/icons/boipoka/Isolation_Mode (2).svg",
    link: "/recommendation",
  },
];

const IamBoared: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen mt-28 bg-white flex flex-col items-center py-8">
      {/* Header */}
      <div className="flex flex-col  sm:flex-row items-center gap-4 mb-6">
        <img
          src="/assets/icons/boipoka/Isolation_Mode.svg"
          alt="juggling"
          className="w-20 h-20 object-contain"
        />
        <h1 className="text-4xl font-bold leading-tight text-center sm:text-left">
          lets have
          <br />
          some fun
        </h1>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 max-w-xl w-full px-4">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.link)}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition"
          >
            <img
              src={card.img}
              alt={card.title}
              className="w-28 h-28 object-contain mb-3"
            />
            <p className="text-sm font-medium text-gray-800">{card.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IamBoared;
