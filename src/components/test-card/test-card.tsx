export type CardTitle = {
  title: string;
};

const TestCard: React.FC<CardTitle> = (props: CardTitle) => {
  return (
    <div>
      <h2>Hi, {props.title}</h2>
    </div>
  );
};

export default TestCard;
