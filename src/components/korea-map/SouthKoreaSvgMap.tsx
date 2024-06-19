import "./map.css";
import mapData from "./mapData.ts";

export const SouthKoreaSvgMap = (props: {
  className: string;
  role: string;
  data: any;
  setColorByCount: (count: number) => string;

  // Locations properties
  locationClassName?: string | ((location: any, index: number) => string);
  locationTabIndex?: number | ((location: any, index: number) => number); // 타입을 string에서 number로 변경
  locationRole?: string;
  locationAriaLabel?: (location: any, index: number) => string;
  onLocationMouseOver?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>
  ) => void;
  onLocationMouseOut?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>
  ) => void;
  onLocationMouseMove?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>
  ) => void;
  onLocationClick?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>
  ) => void;
  onLocationKeyDown?: (event: React.KeyboardEvent<SVGPathElement>) => void;
  onLocationFocus?: (event: React.FocusEvent<SVGPathElement>) => void;
  onLocationBlur?: (event: React.FocusEvent<SVGPathElement>) => void;
  isLocationSelected?: (location: any, index: number) => boolean;

  // Slots
  childrenBefore: React.ReactNode;
  childrenAfter: React.ReactNode;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={mapData.viewBox}
      className={props.className}
      role={props.role}
      aria-label={mapData.label}
    >
      {props.childrenBefore}
      {mapData.locations.map((location, index) => {
        let count = props.data[location.name]?.weatherCode;
        if (!count) {
          count = 0;
        }
        return (
          <path
            id={location.id}
            name={location.name}
            d={location.path}
            className={
              typeof props.locationClassName === "function"
                ? props.locationClassName(location, index)
                : props.locationClassName
            }
            tabIndex={
              typeof props.locationTabIndex === "function"
                ? props.locationTabIndex(location, index)
                : props.locationTabIndex
            }
            role={props.locationRole}
            aria-label={
              typeof props.locationAriaLabel === "function"
                ? props.locationAriaLabel(location, index)
                : location.name
            }
            aria-checked={
              props.isLocationSelected &&
              props.isLocationSelected(location, index)
            }
            onMouseOver={props.onLocationMouseOver}
            onMouseOut={props.onLocationMouseOut}
            onMouseMove={props.onLocationMouseMove}
            onClick={props.onLocationClick}
            onKeyDown={props.onLocationKeyDown}
            onFocus={props.onLocationFocus}
            onBlur={props.onLocationBlur}
            key={location.id}
            fill={props.setColorByCount(count)}
          />
        );
      })}
      {props.childrenAfter}
    </svg>
  );
};

SouthKoreaSvgMap.defaultProps = {
  className: "svg-map",
  role: "none", // No role for map
  locationClassName: "svg-map__location",
  locationTabIndex: 0, // 기본값을 문자열에서 숫자로 변경
  locationRole: "none",
};
