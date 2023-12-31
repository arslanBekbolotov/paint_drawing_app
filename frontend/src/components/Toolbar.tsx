import React from "react";

interface Props {
  setStrokeColor: (color: string) => void;
  setTool: (tool: string) => void;
}

const Toolbar: React.FC<Props> = ({ setStrokeColor, setTool }) => {
  const colors = [
    "white",
    "black",
    "red",
    "blue",
    "yellow",
    "orange",
    "pink",
    "purple",
    "green",
  ];

  return (
    <div style={{ position: "absolute", right: "10px", top: "10px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateRows: "repeat(3,1fr)",
          gridTemplateColumns: "repeat(3,1fr)",
          maxWidth: "120px",
          gap: "5px",
          marginBottom: "10px",
        }}
      >
        {colors.map((color) => (
          <div
            onClick={() => setStrokeColor(color)}
            key={color}
            style={{
              backgroundColor: color,
              width: "25px",
              height: "25px",
              borderRadius: "50%",
              border: "2px solid gray",
            }}
          />
        ))}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setTool("circle")}>Circle</button>
      </div>
      <div>
        <button onClick={() => setTool("brush")}>Brush</button>
      </div>
    </div>
  );
};

export default Toolbar;
