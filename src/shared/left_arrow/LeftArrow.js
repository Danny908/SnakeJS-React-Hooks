import React from "react";
import "./LeftArrow.scss";

export function LeftArrow(props) {
  const active = props.active;

  return (
    <svg
      className={active ? "LeftArrow" : "LeftArrow inactive"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
}
