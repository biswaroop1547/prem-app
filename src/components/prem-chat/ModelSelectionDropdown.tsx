import { useQuery } from "@tanstack/react-query";
import { fetchModels } from "../../shared/api";

type Model = {
  id: string;
  name: string;
};

type ModelSelectionDropdown = {
  model: string;
  onModelChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

const ModelSelectionDropdown = ({
  model,
  onModelChange,
}: ModelSelectionDropdown) => {
  const { data: response } = useQuery(["fetchModels"], fetchModels);

  return (
    <div className="custom-select">
      <select onChange={onModelChange} value={model}>
        <option value="">Select a Model</option>
        {response?.data?.data?.map((model: Model) => (
          <option key={model.id} value={model.id}>
            {model.id}
          </option>
        ))}
      </select>
      <button>
        <svg
          width="9"
          height="6"
          viewBox="0 0 9 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1L4.5 4.5L8 1" stroke="white" strokeWidth="1.5" />
        </svg>
      </button>
    </div>
  );
};
export default ModelSelectionDropdown;
