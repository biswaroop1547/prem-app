import clsx from "clsx";
import { orderBy } from "lodash";
import { Link, useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "shared/components/DeleteIcon";
import NoPrompts from "shared/components/NoPrompts";
import usePremTextAudioStore from "shared/store/prem-text-audio";
import type { HamburgerMenuProps } from "shared/types";
import { shallow } from "zustand/shallow";

import LeftSidebar from "../../../shared/components/LeftSidebar";

const PremTextAudioLeftSidebar = ({ setHamburgerMenu }: HamburgerMenuProps) => {
  const navigate = useNavigate();
  const { serviceId, serviceType, historyId } = useParams();
  const { history, deleteHistory } = usePremTextAudioStore(
    (state) => ({
      history: state.history,
      deleteHistory: state.deleteHistory,
    }),
    shallow,
  );

  const onDeleteClick = (id: string) => {
    deleteHistory(id);
    if (historyId === id) {
      navigate(`/prem-text-audio/${serviceId}/${serviceType}`);
    }
  };

  return (
    <LeftSidebar setHamburgerMenu={setHamburgerMenu}>
      {history.length === 0 && <NoPrompts text="No Audio" />}
      <div className="mt-10 overflow-y-auto custom-scroll">
        <ul className="md:flex-grow scrollbar-none w-full">
          {orderBy(history, "timestamp", "desc").map((item) => {
            return (
              <li key={item.id} className={clsx({ "bg-grey-900": historyId === item.id })}>
                <Link to={`/prem-text-audio/${serviceId}/${item.id}`}>
                  <span className="text-white" title={item.prompt}>
                    {item.file}
                  </span>
                </Link>
                <button onClick={() => onDeleteClick(item.id)}>
                  <DeleteIcon />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </LeftSidebar>
  );
};

export default PremTextAudioLeftSidebar;
