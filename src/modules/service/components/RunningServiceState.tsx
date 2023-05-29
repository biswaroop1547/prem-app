import { useMutation } from "@tanstack/react-query";
import Spinner from "shared/components/Spinner";
import { ServiceStateProps } from "../types";
import StopIcon from "shared/components/StopIcon";
import DeleteIcon from "shared/components/DeleteIcon";
import stopService from "../api/stopService";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const RunningServiceState = ({ serviceId, interfaces, isDetailView, refetch }: ServiceStateProps) => {

  const { mutate, isLoading } = useMutation((id: string) => stopService(id));
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const navigate = useNavigate();

  const onStop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate(serviceId, {
      onSuccess: refetch
    });
  };

  const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpenDeleteModal(true);
  };

  const onPlayButtonClick = () => {
    // check if the service is running
    if (interfaces.includes("chat")) {
      navigate(`/prem-chat/${serviceId}`);
    } else {
      alert("Show Documentation")
    }
  };

  if (isLoading) {
    return <Spinner className="w-5 h-5" />;
  }

  return (
    <>
      <button
        className="border-[0.5px] border-brightgray text-white rounded-[3px] py-1 px-3 text-[10px] font-proximaNova-regular"
        onClick={(e) => e.preventDefault()}
      >
        Running
      </button>
      
      <button className="bg-brightgray rounded-3xl px-6 py-[10px] text-sm" onClick={onPlayButtonClick}>
        Open &nbsp; &#8594;
      </button>
      
      {isDetailView && <div>
        <button onClick={onStop}>
          <StopIcon />
        </button>
        <button onClick={onDelete}>
          <DeleteIcon />
        </button>
      </div>}  
    </>
  );
};

export default RunningServiceState;
