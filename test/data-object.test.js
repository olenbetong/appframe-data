const { DataObject } = require('../src/data-object');
global.fetch = require('jest-fetch-mock');

describe('DataObject', () => {
	beforeEach(() => {
		fetch.resetMocks();
	});

	it('gets correct ID', () => {
		const dataObject = new DataObject({
			dataSourceId: 'dsTestObject'
		});

		expect(dataObject.getDataSourceId()).toBe('dsTestObject');

		// check that data object gets article from af.article.id
		// global is defined in jest config
		expect(dataObject._options.articleId).toBe('test-article');
	});

	test('has a functioning recordSource helper', () => {
		const dataObject = new DataObject({});
		const params = [
			['filterObject', 'getFilterObject', 'setFilterObject'],
			['filterString', 'getFilterString', 'setFilterString'],
			['maxRecords', 'getMaxRecords', 'setMaxRecords'],
			['sortOrder', 'getSortOrder', 'setSortOrder'],
			['whereClause', 'getWhereClause', 'setWhereClause'],
			['whereObject', 'getWhereObject', 'setWhereObject'],
		];

		for (let param of params) {
			const [name, getter, setter] = param;
			const value = Math.random();
			const value2 = Math.random();

			expect(getter in dataObject.recordSource).toBe(true);
			expect(setter in dataObject.recordSource).toBe(true);

			dataObject.setParameter(name, value);
			expect(dataObject.recordSource[getter]()).toBe(value);

			dataObject.recordSource[setter](value2);
			expect(dataObject.getParameter(name)).toBe(value2);
		}
	});
});