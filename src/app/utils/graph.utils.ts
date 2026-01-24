import * as d3 from 'd3';

export function renderBooksReadChart(
  container: any,
  booksReadTotal: number,
  booksReadByYear: {
    year: number;
    count: number;
  }[]
): void {
  if (!container || booksReadTotal === 0) {
    return;
  }

  const data = booksReadByYear;
  const containerWidth = container.clientWidth || 600;
  const width = Math.max(containerWidth, 320);
  const height = 260;
  const margin = { top: 10, right: 20, bottom: 35, left: 40 };

  d3.select(container).selectAll('*').remove();

  const svg = d3
    .select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMinYMin meet');

  const tooltip = d3
    .select(container)
    .append('div')
    .attr('class', 'chart-tooltip');

  const x = d3
    .scaleBand<string>()
    .domain(data.map((d: any) => d.year.toString()))
    .range([margin.left, width - margin.right])
    .padding(0.15);

  const maxCount = Math.max(1, d3.max(data, (d: any) => Number(d.count)) || 1);
  const y = d3
    .scaleLinear()
    .domain([0, maxCount])
    .nice()
    .range([height - margin.bottom, margin.top]);

  svg
    .append('g')
    .attr('class', 'cinema-grid')
    .attr('transform', `translate(${margin.left},0)`)
    .call(
      d3
        .axisLeft(y)
        .ticks(5)
        .tickSize(-(width - margin.left - margin.right))
        .tickFormat(() => '')
    );

  svg
    .append('g')
    .attr('class', 'cinema-bars')
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (d: any) => x(d.year.toString()) || 0)
    .attr('y', (d: any) => y(Number(d.count)))
    .attr('height', (d: any) => y(0) - y(Number(d.count)))
    .attr('width', x.bandwidth())
    .attr('rx', 3)
    .attr('fill', '#28a745')
    .on('mouseenter', (event: any, d: any) => {
      tooltip.style('opacity', '1').text(`${d.count} livre(s)`);
      const [xPos, yPos] = d3.pointer(event, container);
      tooltip.style('left', `${xPos + 10}px`).style('top', `${yPos - 10}px`);
    })
    .on('mousemove', (event: any) => {
      const [xPos, yPos] = d3.pointer(event, container);
      tooltip.style('left', `${xPos + 10}px`).style('top', `${yPos - 10}px`);
    })
    .on('mouseleave', () => {
      tooltip.style('opacity', '0');
    });

  svg
    .append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(
      d3
        .axisBottom(x)
        .tickValues(
          data
            .filter((_: any, index: number) => index % 2 === 0)
            .map((item: any) => item.year.toString())
        )
    )
    .selectAll('text')
    .attr('transform', 'rotate(-25)')
    .style('text-anchor', 'end');

  svg
    .append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('d')));
}

export function renderMoviesCinemaChart(
  container: any,
  moviesCinemaTotal: number,
  moviesCinemaByYear: {
    year: number;
    count: number;
  }[]
): void {
  if (!container || moviesCinemaTotal === 0) {
    return;
  }

  const data = moviesCinemaByYear;
  const containerWidth = container.clientWidth || 600;
  const width = Math.max(containerWidth, 320);
  const height = 260;
  const margin = { top: 10, right: 20, bottom: 35, left: 40 };

  d3.select(container).selectAll('*').remove();

  const svg = d3
    .select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMinYMin meet');

  const tooltip = d3
    .select(container)
    .append('div')
    .attr('class', 'chart-tooltip');

  const x = d3
    .scaleBand<string>()
    .domain(data.map((d: any) => d.year.toString()))
    .range([margin.left, width - margin.right])
    .padding(0.15);

  const maxCount = Math.max(1, d3.max(data, (d: any) => d.count) || 1);
  const y = d3
    .scaleLinear()
    .domain([0, maxCount])
    .nice()
    .range([height - margin.bottom, margin.top]);

  svg
    .append('g')
    .attr('class', 'cinema-grid')
    .attr('transform', `translate(${margin.left},0)`)
    .call(
      d3
        .axisLeft(y)
        .ticks(5)
        .tickSize(-(width - margin.left - margin.right))
        .tickFormat(() => '')
    );

  svg
    .append('g')
    .attr('class', 'cinema-bars')
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (d: any) => x(d.year.toString()) || 0)
    .attr('y', (d) => y(d.count))
    .attr('height', (d) => y(0) - y(d.count))
    .attr('width', x.bandwidth())
    .attr('rx', 3)
    .attr('fill', '#007bff')
    .on('mouseenter', (event: any, d: any) => {
      tooltip.style('opacity', '1').text(`${d.count} film(s)`);
      const [xPos, yPos] = d3.pointer(event, container);
      tooltip.style('left', `${xPos + 10}px`).style('top', `${yPos - 10}px`);
    })
    .on('mousemove', (event: any) => {
      const [xPos, yPos] = d3.pointer(event, container);
      tooltip.style('left', `${xPos + 10}px`).style('top', `${yPos - 10}px`);
    })
    .on('mouseleave', () => {
      tooltip.style('opacity', '0');
    });

  svg
    .append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(
      d3
        .axisBottom(x)
        .tickValues(
          data
            .filter((_, index) => index % 2 === 0)
            .map((item) => item.year.toString())
        )
    )
    .selectAll('text')
    .attr('transform', 'rotate(-25)')
    .style('text-anchor', 'end');

  svg
    .append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('d')));
}
