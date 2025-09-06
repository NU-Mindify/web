import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  ReactFlow
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import axios from "axios";
import Lottie from "lottie-react";
import { useCallback, useState } from "react";
import loading from '../../assets/animation/loading.json';
import { API_URL } from "../../Constants";
import CustomNode from "./CustomNode";


const nodeTypes = {
  default: CustomNode,
};

const proOptions = { hideAttribution: true };

export default function Mindmap() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const [prompt, setPrompt] = useState(urlParams.get("myParam") || "")

  const onGenerate = async () => {
    setNodes([])
    setEdges([])
    setIsLoading(true)
    try {
      const { data } = await axios.post(API_URL + "/generateMindmap", { prompt });
      setNodes(data.nodes)
      setEdges(data.edges)
    } catch (error) {
      console.error(error);
      alert("Error Loading the mindmap")
    }
    setIsLoading(false)
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
      <div className="bg-white border-b-2 md:border-e-2 border-black p-4 h-fit absolute z-[100] top-0 w-full md:w-fit">
        <div className="mx-auto">
          <div>Genarate Mind map</div>
          <div className="flex">
            <input
              type="text"
              className="input input-ghost !bg-transparent border border-black md:w-[300px]"
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
            />
            <button
              className="btn !text-white disabled:!bg-gray-500 bg-black"
              onClick={onGenerate}
              disabled={prompt.trim() === "" || isLoading}
            >
              Generate
            </button>
          </div>
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
        {isLoading && (
          <Lottie animationData={loading} loop={true} style={{ height: 300, marginTop: 50 }} />
        )}
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
