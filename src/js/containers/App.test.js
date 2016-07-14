import { shallow } from 'enzyme';
import { h } from 'react-hyperscript-helpers';

import App from 'containers/App';

describe('<App />', () => {
  it('should exist', () => {
    const wrapper = shallow(h(App));
    expect(wrapper.type()).to.equal('div');
  });

  it('should be able to pass children', () => {
    const wrapper = shallow(h(App, { children: [1, 2, 3, 4] }));
    expect(wrapper.children()).to.have.length(4);
  });
});
