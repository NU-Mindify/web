import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode";
import axios from "axios";
import { API_URL } from "../../Constants";


const nodeTypes = {
  default: CustomNode,
};

const proOptions = { hideAttribution: true };

export default function Mindmap() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const urlParams = new URLSearchParams(window.location.search);
  const [prompt, setPrompt] = useState(urlParams.get("myParam") || "")

  const onGenerate = async () => {
    setNodes([])
    setEdges([])
    const { data } = await axios.post(API_URL + "/generateMindmap", { prompt });
    setNodes(data.nodes)
    setEdges(data.edges)
  };

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "white" }}>
      <div className="bg-white broder border-black p-4 mx-auto w-fit">
        <div>Genarate Mind map</div>
        <div className="flex">
          <input
            type="text"
            className="input input-ghost !bg-transparent border border-black w-[300px]"
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
          />
          <button className="btn !text-white disabled:!bg-gray-500" onClick={onGenerate} disabled={prompt.trim() === ""}>
            Generate
          </button>
        </div>
      </div>
      <ReactFlow
        colorMode="light"
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        proOptions={proOptions}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
