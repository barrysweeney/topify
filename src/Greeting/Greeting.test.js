import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

import { Greeting } from "./Greeting";

it("Should render user's name with greeting in header", () => {
  const wrapper = shallow(<Greeting name={"Bob"} />);
  const header = wrapper.find("h1").text();
  expect(header).toBe("Hello Bob");
});
