import { shallow } from 'enzyme';
import React from 'react';

import { App } from './App';

describe('<App />', () => {
  it('should exist', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.type()).to.equal('div');
  });

  it('should contain top level components', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.children()).to.have.length(4);
  });
});
