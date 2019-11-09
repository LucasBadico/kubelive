'use strict';
const React = require('react');
const { shallow } = require('enzyme');
const executeActionMock = jest.fn();
const mockActions = {
  actions: [
    {
      key: 'c',
      descrition: 'Copy'
    }
  ],
  executeAction: executeActionMock
};
jest.mock('../../src/actions/pod', () => mockActions);
const { actions } = require('../../src/actions/pod');
const importJsx = require('import-jsx');
const PodsComponent = importJsx('../../src/components/pods');
const { TableComponent } = importJsx('../../src/components/table');

describe('PodsComponent', () => {
  let component;
  let tableComponent;
  const pods = [
    {
      name: 'some-pod-name'
    }
  ];
  let namespace = 'some-name';

  beforeEach(() => {
    component = shallow(
      <PodsComponent
        items={pods}
        stdin={{ on: () => {} }}
        setRawMode={() => {}}
        namespace={namespace}
      />
    );
    tableComponent = component.find(TableComponent).first();
    executeActionMock.mockClear();
  });

  it('should match the snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('tableComponent should get passed the data props as pods', () => {
    expect(tableComponent.props().data).toEqual(pods);
  });

  it('tableComponent should get passed the namespace props', () => {
    expect(tableComponent.props().namespace).toEqual(namespace);
  });

  it('tableComponent should get passed the actions props', () => {
    expect(tableComponent.props().actions).toEqual(actions);
  });

  it('tableComponent should call executeAction(key, name, namespace) when onActionPerformed is called', () => {
    const key = { name: 'c' };
    const name = 'some-pod-name';

    tableComponent.invoke('onActionPerformed')({ key, name, namespace });

    expect(executeActionMock).toHaveBeenCalledWith(key, name, namespace);
  });
});
