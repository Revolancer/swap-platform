export const Logo = ({ expanded = false, color = "default" }) => {
  var variant = "";
  if (!expanded) {
    variant += "Short";
  }
  if (color == "black") {
    variant += "Black";
  }
  if (color == "white") {
    variant += "White";
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img height="24px" src={`/logo/Logo${variant}.svg`} alt="Revolancer" />
  );
};
