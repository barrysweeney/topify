import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

import Navbar from "./Navbar";

describe("<Navbar />", () => {
  it("provides link to user's profile", () => {
    const wrapper = shallow(<Navbar profile={"https://example.com"} />);
    expect(wrapper.find("a.profile-link").prop("href")).toBe(
      "https://example.com"
    );
  });
});
