import React, { useState } from "react";
import useAuth from "../../hooks/use-auth";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login({ username, password });
      navigate("/home");
    } catch {
      alert("Invalid credentials.");
    }
  };

  return (
    <div className="bs-form">
      <h2 className="form-title">Login Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <TextField
            name="username"
            type={"text"}
            fullWidth
            label={"Username"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <TextField
            name="password"
            type={"password"}
            fullWidth
            label={"Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-action">
          <Button type="submit" variant="outlined">
            Login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
