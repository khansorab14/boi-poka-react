import { motion } from "framer-motion";

interface TriviaItem {
  _id: string;
  triviaId: string;
  date: string;
  title: string;
  fact: string;
  alreadyRead?: boolean;
  message?: string;
}

interface TriviaCarouselProps {
  trivias: TriviaItem[];
}

export default function TriviaCarousel({ trivias }: TriviaCarouselProps) {
  if (!trivias?.length) {
    return <p className="text-center text-gray-400">No trivia found</p>;
  }

  return (
    <div className="flex overflow-x-auto gap-4 p-4">
      {trivias.map((trivia) => (
        <motion.div
          key={trivia._id}
          className="min-w-[300px] bg-white rounded-2xl shadow p-4 flex flex-col"
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-lg font-bold mb-2">{trivia.title}</h2>
          <div
            className="text-sm text-gray-700 mb-2"
            dangerouslySetInnerHTML={{ __html: trivia.fact }}
          />
          <p className="text-xs text-gray-400">
            {new Date(trivia.date).toLocaleDateString()}
          </p>

          {trivia.alreadyRead && trivia.message && (
            <div className="mt-3 p-2 text-sm bg-yellow-100 text-yellow-700 rounded">
              {trivia.message}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
