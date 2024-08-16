import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import "./popover.css";

const Popover = ({
  children,
  content,
  trigger = "hover",
  placement = "bottom",
  getContainer = () => document.body,
  width = 0,
}) => {
  const [visible, setVisible] = useState(false);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const contentEl = useRef(null);

  const setVisibility = (visible) => setVisible(visible);

  const toggleVisibility = () => setVisible((prevState) => !prevState);

  const handleContentEnter = (e) => {
    if (trigger === "hover") {
      setVisibility(true);
    }
  };

  const handleContentLeave = (e) => {
    if (trigger === "hover") {
      setVisibility(false);
    }
  };

  const setPositions = (target) => {
    const contentRect = contentEl?.current?.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const position = getPosition(placement, contentRect, targetRect);
    setTop(position.top);
    setLeft(position.left);
  };

  const getChildProps = (childProps) => {
    const props = { ...childProps };

    const handleMouseEnter = (e) => {
      if (childProps.onMouseEnter) {
        childProps.onMouseEnter(e);
      }
      setVisibility(true);
      setPositions(e.currentTarget);
    };

    const handleMouseLeave = (e) => {
      if (childProps.onMouseLeave) {
        childProps.onMouseLeave(e);
      }
      setVisibility(false);
    };

    const handleClick = (e) => {
      if (childProps.onClick) {
        childProps.onClick(e);
      }
      toggleVisibility();
      setPositions(e.currentTarget);
    };

    if (trigger === "hover") {
      props.onMouseEnter = handleMouseEnter;
      props.onMouseLeave = handleMouseLeave;
    } else if (trigger === "click") {
      props.onClick = handleClick;
    }

    return props;
  };

  const getContentStyles = () => {
    return {
      position: "fixed",
      visibility: visible ? "visible" : "hidden",
      opacity: visible ? 1 : 0,
      top: `${top + 10}px`,
      left: `${width ? left + width : left}px`,
      transition: "opacity 0.3s, visibility 0.3s",
      backgroundColor: "white",
      zIndex: 99,
      borderRadius: "var(--border-radius)",
      boxShadow: "var(--box-shadow-flat)",
      padding: "var(--space-4) 0",
    };
  };

  return (
    <div style={{ position: "relative" }}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return <child.type {...getChildProps(child.props)} />;
        }
        return child;
      })}
      {ReactDOM.createPortal(
        <div
          ref={contentEl}
          onMouseEnter={handleContentEnter}
          onMouseLeave={handleContentLeave}
          style={getContentStyles()}
        >
          <div className="popoverBox">{content}</div>
          <div className="bottom-arrow" />
        </div>,
        getContainer()
      )}
    </div>
  );
};

export default Popover;

export const getPosition = (placement, elRect, targetRect) => {
  switch (placement) {
    case "top":
      return getTopPosition(elRect, targetRect);
    case "right":
      return getRightPosition(elRect, targetRect);
    case "bottom":
      return getBottomPosition(elRect, targetRect);
    case "left":
      return getLeftPosition(elRect, targetRect);
    default:
      return getBottomPosition(elRect, targetRect);
  }
};

const getTopPosition = (elRect, targetRect) => {
  return {
    left: targetRect.left + targetRect.width / 2 - elRect.width / 2,
    top: targetRect.top - elRect.height,
  };
};

const getRightPosition = (elRect, targetRect) => {
  return {
    left: targetRect.left + targetRect.width,
    top: targetRect.top + targetRect.height / 2 - elRect.height / 2,
  };
};

const getBottomPosition = (elRect, targetRect) => {
  return {
    left: targetRect.left + targetRect.width / 2 - elRect.width / 2,
    top: targetRect.top + targetRect.height,
  };
};

const getLeftPosition = (elRect, targetRect) => {
  return {
    left: targetRect.left - elRect.width,
    top: targetRect.top + targetRect.height / 2 - elRect.height / 2,
  };
};
