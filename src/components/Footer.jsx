const Footer = () => {
  const handleClick = (url) => {
    window.open(url, "_blank"); // Opens the link in a new tab
  };
  return (
    <div className="absolute flex bottom-5 w-full justify-center">
      <div
        onClick={() => {
          handleClick("https://www.instagram.com/eudaimoniajin/");
        }}
        className="m-3 cursor-pointer "
      >
        Developer - Jin
      </div>
      <div
        onClick={() => {
          handleClick("https://www.youtube.com/@gamst6217");
        }}
        className="m-3 cursor-pointer "
      >
        Original - Gamst
      </div>
    </div>
  );
};

export default Footer;
