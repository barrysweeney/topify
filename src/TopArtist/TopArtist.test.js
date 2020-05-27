import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

import { TopArtist } from "./TopArtist";

it("Should render the name of the user's top artist in paragraph", () => {
  const wrapper = shallow(<TopArtist name={"Blink-182"} />);
  const paragraph = wrapper.find("p").text();
  expect(paragraph).toBe("Blink-182");
});
