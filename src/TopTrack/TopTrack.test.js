import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

import { TopTrack } from "./TopTrack";

it("Should render the name of the user's top track in paragraph", () => {
  const wrapper = shallow(<TopTrack name={"Wheels"} />);
  const paragraph = wrapper.find("p").text();
  expect(paragraph).toBe("Wheels");
});
