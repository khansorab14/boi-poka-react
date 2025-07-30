import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/login");
  };
  return (
    <div>
      <h1>403 - Forbidden</h1>
      <p>You do not have permission to access this page.</p>
      <Button onClick={handleClick}>Login to access</Button>
    </div>
  );
};

export default Forbidden;
