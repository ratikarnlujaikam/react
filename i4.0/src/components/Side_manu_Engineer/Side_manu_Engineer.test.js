import React from "react";
import { shallow } from "enzyme";
import Side_manu_Engineer from "./Side_manu_Engineer";

describe("Side_manu_Engineer", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Side_manu_Engineer />);
    expect(wrapper).toMatchSnapshot();
  });
});
