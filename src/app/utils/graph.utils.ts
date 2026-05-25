import * as d3 from 'd3';
import type { ScanTrackingPeriod } from './dashboard-monthly-activity.utils';

const SCAN_TRACKING_CHART_COLORS = [
  '#4e79a7',
  '#f28e2b',
  '#e15759',
  '#76b7b2',
  '#59a14f',
  '#edc948',
  '#b07aa1',
  '#ff9da7',
  '#9c755f',
  '#bab0ac',
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
];

function formatScanChartDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatScanTrackingTooltipHtml(row: ScanTrackingPeriod): string {
  const durationLine = row.durationLabel
    ? `<br/>Temps de jeu : <strong>${row.durationLabel}</strong>`
    : '';
  return `<strong>${row.label}</strong><br/>${formatScanChartDate(
    row.start,
  )} → ${formatScanChartDate(row.end)}${durationLine}`;
}

/** Positionne la tooltip au curseur (viewport), pour les graphiques SVG scrollables. */
function positionChartTooltipAtPointer(
  tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>,
  event: MouseEvent,
): void {
  tooltip
    .style('position', 'fixed')
    .style('left', `${event.clientX + 12}px`)
    .style('top', `${event.clientY + 12}px`)
    .style('z-index', '10000');
}

function measureMaxTextWidth(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  texts: string[],
  fontSize: number
): number {
  const tempText = svg
    .append('text')
    .attr('visibility', 'hidden')
    .attr('font-size', `${fontSize}px`)
    .attr('font-family', 'sans-serif');

  let maxWidth = 0;
  texts.forEach((text) => {
    tempText.text(text);
    maxWidth = Math.max(
      maxWidth,
      (tempText.node() as SVGTextElement).getBBox().width
    );
  });

  tempText.remove();
  return maxWidth;
}

export function renderScanTrackingTimelineChart(
  container: HTMLElement | null | undefined,
  periods: ScanTrackingPeriod[],
  options: {
    startYear: number;
    endYear: number;
  }
): void {
  if (!container || periods.length === 0) {
    return;
  }

  const { startYear, endYear } = options;
  const rangeStart = new Date(startYear, 0, 1);
  rangeStart.setHours(0, 0, 0, 0);
  const rangeEnd = new Date(endYear, 11, 31, 23, 59, 59, 999);

  const rows = periods
    .map((period) => {
      const displayStart =
        period.start.getTime() < rangeStart.getTime()
          ? rangeStart
          : period.start;
      const displayEnd =
        period.end.getTime() > rangeEnd.getTime() ? rangeEnd : period.end;
      return { ...period, displayStart, displayEnd };
    })
    .filter(
      (period) => period.displayEnd.getTime() >= period.displayStart.getTime()
    );

  if (rows.length === 0) {
    return;
  }

  d3.select(container).selectAll('*').remove();

  const colorByKey = new Map<string, string>();
  rows.forEach((row, index) => {
    colorByKey.set(
      row.key,
      SCAN_TRACKING_CHART_COLORS[index % SCAN_TRACKING_CHART_COLORS.length]
    );
  });

  const containerWidth = container.clientWidth || 600;
  const width = Math.max(containerWidth, 320);
  const rowHeight = 28;
  const labelFontSize = 11;
  const swatchSize = 10;
  const swatchGap = 6;
  const rowTitles = rows.map((row) => row.label);

  const svg = d3
    .select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} 100`)
    .attr('preserveAspectRatio', 'xMinYMin meet');

  const maxTitleWidth = measureMaxTextWidth(svg, rowTitles, labelFontSize);
  const labelColumnWidth = Math.min(
    220,
    Math.ceil(maxTitleWidth + swatchSize + swatchGap + 4)
  );
  const margin = {
    top: 44,
    right: 24,
    bottom: 44,
    left: labelColumnWidth + 12,
  };
  const chartHeight = rows.length * rowHeight;
  const height = margin.top + chartHeight + margin.bottom;

  svg.attr('viewBox', `0 0 ${width} ${height}`);

  const tooltip = d3
    .select(container)
    .append('div')
    .attr('class', 'chart-tooltip');

  const x = d3
    .scaleTime()
    .domain([rangeStart, rangeEnd])
    .range([margin.left, width - margin.right]);

  const y = d3
    .scaleBand<string>()
    .domain(rows.map((row) => row.key))
    .range([margin.top, margin.top + chartHeight])
    .padding(0.25);

  const gridYears = d3.range(startYear, endYear + 1, 2);
  svg
    .append('g')
    .attr('class', 'scan-timeline-grid')
    .selectAll('line')
    .data(gridYears)
    .join('line')
    .attr('x1', (year) => x(new Date(year, 0, 1)))
    .attr('x2', (year) => x(new Date(year, 0, 1)))
    .attr('y1', margin.top)
    .attr('y2', margin.top + chartHeight)
    .attr('stroke', '#e3e6ea');

  svg
    .append('g')
    .attr('class', 'scan-timeline-labels')
    .selectAll('g')
    .data(rows)
    .join('g')
    .attr('class', 'scan-timeline-label')
    .attr('transform', (row) => {
      const yPos = (y(row.key) ?? 0) + y.bandwidth() / 2;
      return `translate(0, ${yPos})`;
    })
    .each(function (row) {
      const group = d3.select(this);
      const color = colorByKey.get(row.key) ?? '#4e79a7';

      group
        .append('rect')
        .attr('x', 0)
        .attr('y', -swatchSize / 2)
        .attr('width', swatchSize)
        .attr('height', swatchSize)
        .attr('rx', 2)
        .attr('fill', color);

      group
        .append('text')
        .attr('x', swatchSize + swatchGap)
        .attr('y', 0)
        .attr('dy', '0.35em')
        .attr('fill', '#495057')
        .attr('font-size', `${labelFontSize}px`)
        .attr('font-family', 'sans-serif')
        .text(row.label);
    });

  svg
    .append('g')
    .attr('class', 'scan-timeline-bars')
    .selectAll('rect')
    .data(rows)
    .join('rect')
    .attr('x', (row) => x(row.displayStart))
    .attr('y', (row) => y(row.key) ?? 0)
    .attr('width', (row) =>
      Math.max(2, x(row.displayEnd) - x(row.displayStart))
    )
    .attr('height', y.bandwidth())
    .attr('rx', 3)
    .attr('fill', (row) => colorByKey.get(row.key) ?? '#4e79a7')
    .on('mouseenter', (event: MouseEvent, row) => {
      tooltip.style('opacity', '1').html(formatScanTrackingTooltipHtml(row));
      positionChartTooltipAtPointer(tooltip, event);
    })
    .on('mousemove', (event: MouseEvent) => {
      positionChartTooltipAtPointer(tooltip, event);
    })
    .on('mouseleave', () => {
      tooltip.style('opacity', '0');
    });

  const yearTickFormat = (value: Date | d3.NumberValue) =>
    d3.timeFormat('%Y')(value as Date);

  const yearAxisTop = d3
    .axisTop(x)
    .ticks(d3.timeYear.every(2))
    .tickFormat(yearTickFormat);

  const yearAxisBottom = d3
    .axisBottom(x)
    .ticks(d3.timeYear.every(2))
    .tickFormat(yearTickFormat);

  const applyYearAxisLabelStyle = (
    axisGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  ) => {
    axisGroup
      .selectAll('text')
      .attr('transform', 'rotate(-25)')
      .style('text-anchor', 'end');
  };

  applyYearAxisLabelStyle(
    svg
      .append('g')
      .attr('class', 'scan-timeline-axis scan-timeline-axis--top')
      .attr('transform', `translate(0,${margin.top})`)
      .call(yearAxisTop),
  );

  applyYearAxisLabelStyle(
    svg
      .append('g')
      .attr('class', 'scan-timeline-axis scan-timeline-axis--bottom')
      .attr('transform', `translate(0,${margin.top + chartHeight})`)
      .call(yearAxisBottom),
  );
}

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
      positionChartTooltipAtPointer(tooltip, event);
    })
    .on('mousemove', (event: any) => {
      positionChartTooltipAtPointer(tooltip, event);
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
      positionChartTooltipAtPointer(tooltip, event);
    })
    .on('mousemove', (event: any) => {
      positionChartTooltipAtPointer(tooltip, event);
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

export function renderMoviesWatchedChart(
  container: any,
  moviesWatchedTotal: number,
  moviesWatchedByYear: {
    year: number;
    count: number;
  }[]
): void {
  if (!container || moviesWatchedTotal === 0) {
    return;
  }

  const data = moviesWatchedByYear;
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
    .attr('fill', '#17a2b8')
    .on('mouseenter', (event: any, d: any) => {
      tooltip.style('opacity', '1').text(`${d.count} film(s) vus`);
      positionChartTooltipAtPointer(tooltip, event);
    })
    .on('mousemove', (event: any) => {
      positionChartTooltipAtPointer(tooltip, event);
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

/** Graphique saisons de séries visionnées par an (basé sur lastViewedDate des saisons). */
export function renderSeriesSeasonsViewedChart(
  container: any,
  seriesSeasonsTotal: number,
  seriesSeasonsByYear: {
    year: number;
    count: number;
  }[]
): void {
  if (!container || seriesSeasonsTotal === 0) {
    return;
  }

  const data = seriesSeasonsByYear;
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
    .attr('fill', '#6f42c1')
    .on('mouseenter', (event: any, d: any) => {
      tooltip.style('opacity', '1').text(`${d.count} saison(s) visionnée(s)`);
      positionChartTooltipAtPointer(tooltip, event);
    })
    .on('mousemove', (event: any) => {
      positionChartTooltipAtPointer(tooltip, event);
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
