import { FC } from "react";
import { NavLink } from "react-router-dom";
import { commify } from "@ethersproject/units";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-solid-svg-icons/faSquare";
import { slotURL } from "../../url";

type SlotLinkProps = {
  slotNumber: number;
};

const SlotLink: FC<SlotLinkProps> = ({ slotNumber }) => {
  let text = commify(slotNumber);

  return (
    <NavLink
      className="flex space-x-2 items-baseline text-link-blue hover:text-link-blue-hover font-blocknum"
      to={slotURL(slotNumber)}
    >
      <FontAwesomeIcon className="self-center" icon={faSquare} size="1x" />
      <span>{text}</span>
    </NavLink>
  );
};

export default SlotLink;
