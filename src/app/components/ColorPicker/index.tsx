import { Dispatch, SetStateAction } from "react";
import { SketchPicker } from "react-color";

interface PickerProps {
  showPicker: boolean;
  setShowPicker: Dispatch<SetStateAction<boolean>>;
  color?: string;
  handleColorChange?: (color: any) => void;
  handleOpacityChange?: (event: any) => void;
  rgbcolor: {
    r: number;
    g: number;
    b: number;
  };
  opacity?: number;
}

const ColorPicker = ({
  showPicker,
  setShowPicker,
  color,
  handleColorChange,
  handleOpacityChange,
  rgbcolor,
  opacity,
}: PickerProps) => {
  return (
    <div className="flex absolute w-[300px] h-[60%] right-[0%] top-[25%]">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="mb-2 p-2 z-30 rounded absolute top-[41%] left-[80%]  "
      >
        <img
          src="https://imgur.com/GP2GJgq.png"
          className="w-[40px] h-[40px]"
          alt=""
        />
      </button>
      {showPicker ? (
        <div
          className="w-[179px] h-[315px] relative left-[23%] top-[15%] bg-white rounded-md z-10 p-2"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.15) 0px 8px 16px",
          }}
        >
          <SketchPicker
            width="100%"
            color={color}
            styles={{
              default: {
                picker: {
                  padding: "0rem",
                  border: "1px solid transparent",
                  boxShadow: "none",
                  color: "black",
                  fontWeight: "bold",
                },
              },
            }}
            disableAlpha
            onChange={handleColorChange}
          />

          <div
            className="w-full h-3 flex justify-center"
            style={{
              backgroundImage:
                "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAQCAYAAAD06IYnAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AIWDwYQlZMa3gAAAWVJREFUaN7tmEGO6jAQRCsOArHgBpyAJYGjcGocxAm4A2IHpmoWE0eBH+ezmFlNvU06shJ3W6VEelWMUQAIIF9f6qZpimsA1LYtS2uF51/u27YVAFZVRUkEoGHdPV/sIcbIEIIkUdI/9Xa7neyv61+SWFUVAVCSct00TWn2fv6u3+Ecfd3tXzy/0+nEUu+SPjo/kqzrmiQpScN6v98XewfA8/lMkiLJ2WxGSUopcT6fM6U0NX9/frfbjev1WtfrlZfLhYfDQQHG/AIOlnGwjINlHCxjHCzjYJm/TJWdCwquJXseFFzGwDNNeiKMOJTO8xQdDQaeB29+K9efeLaBo9J7vdvtJj1RjFFjfiv7qv95tjx/7leSQgh93e1ffMeIp6O+YQjho/N791t1XVOSSI7N//K+4/GoxWLBx+PB5/Op5XLJ+/3OlJJWqxU3m83ovv5iGf8KjYNlHCxjHCzjYBkHy5gf5gusvQU7U37jTAAAAABJRU5ErkJggg==)",
              backgroundSize: "100% 100%",
            }}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              className="w-full  h-[0.90rem] rounded-sm cursor-pointer"
              style={{
                background: `linear-gradient(280deg, rgba(${rgbcolor.r},${rgbcolor.g},${rgbcolor.b},0.8) 46%, rgba(47,33,34,0.2) 100%)`,
                border: "1px solid black",
              }}
              value={opacity}
              onChange={handleOpacityChange}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ColorPicker;
