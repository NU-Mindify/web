// CustomNode.jsx
import { Handle, Position } from "@xyflow/react";
import React, { memo } from "react";


const CustomNode = ({ data }) => {
  const handleClick = () => {
    // This is where you'll handle displaying the description or other data
    alert(`Description: ${data.description}`);
    // You could also set a state variable to display this information in a modal or a sidebar
  };

  return (
    <button className="custom-node" onClick={handleClick} >
      <Handle type="target" position={Position.Top} />
      <div className="custom-node-content">
        <strong>{data.label}</strong>
        <div className="text-[6px]">{data.description}</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </button>
  );
};

export default memo(CustomNode);
