// Vendor
import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'

/*----------------------------------------------------------------------------*/

const getNestedValue = (item, path) => {
  if (path.length === 1) {
    return item[path[0]]
  }

  const nextItem = item[path[0]]
  path.shift()

  return getNestedValue(nextItem, path)
}

const renderSVG = (data = [1, 2, 3, 4]) => {
  const width = 100
  const height = 100
  const color = d3.scaleOrdinal(d3.schemeCategory10)
  const outerRadius = height / 2 + 10

  const node = ReactFauxDOM.createElement('svg')

  const pie = d3.pie()
    // .sort(null)
    // .value(d => getNestedValue(d, 'doc_count'.split('.')))

  const arc = d3.arc()
    .padRadius(outerRadius)
    .innerRadius(0)

  const svg = d3.select(node).append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`)

  const g = svg.selectAll('.arc')
    .data(pie(data))
    .enter()
    .append('g')
    .each(d => { d.outerRadius = outerRadius - 20 }) // eslint-disable-line
    .attr('class', 'arc')

  const gPath = g.append('path')

  gPath.attr('d', arc)
    .style('fill', (d, i) => color(i))


  return node.toReact()
}

const PieChart = ({ data }) => (
  <div>
    {renderSVG(data)}
  </div>
)

PieChart.propTypes = {
  data: PropTypes.array,
}

/*----------------------------------------------------------------------------*/

export default PieChart
