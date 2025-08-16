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
    <button className="custom-node " onClick={handleClick}>
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="target" position={Position.Bottom} id="bottom" />
      <Handle type="target" position={Position.Right} id="right" />
      <div className="custom-node-content">
        <strong>{data.label}</strong>
        <div
          className="text-[8px]"
          style={{ textShadow: `0px 0px 12px ${data.color || "black"}` }}
        >
          {data.description}
        </div>
      </div>
      <Handle type="source" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right" />
    </button>
  );
};

export default memo(CustomNode);
