const Loading = () => {
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <div className="w-[24px] h-[24px] rounded-full border-[2px] border-[transparent] border-t-[#000] animate-spin"></div>
    </div>
  );
};

export default Loading;
