const PersonaHeader = () => {
  return (
    <div className="w-full flex justify-between items-start mb-8">
      <div className="text-left">
        <h1 className="text-5xl font-extrabold leading-none">analytics</h1>
        <h1 className="text-5xl font-extrabold leading-none">for me</h1>
      </div>
      <img
        src="/assets/icons/poka-persona.svg"
        alt="Poka Persona"
        className="w-32 h-32"
      />
    </div>
  );
};

export default PersonaHeader;
