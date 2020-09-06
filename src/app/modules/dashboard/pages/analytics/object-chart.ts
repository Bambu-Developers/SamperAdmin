import { CHART_TYPES } from './data/data';
export function createChart(type: number, labels: string[], data: number[], axisLabels?: string[], orientation?: string) {
    switch (type) {
        case CHART_TYPES.LINE:
            return new LineChar('line', labels, data, axisLabels);
        case CHART_TYPES.BAR:
            return new BarChar('bar', labels, data, axisLabels, orientation);
        case CHART_TYPES.PIE:
            return new PieChar('pie', labels, data);
    }
}

export class LineChar {
    type;
    labels;
    data;
    lineClass = [{
        backgroundColor: 'transparent',
        borderColor: '#4ddade',
        pointBackgroundColor: '#4ddade',
        pointBorderColor: '#4ddade',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }];
    barChartData = [
        { data: [], borderWidth: 1 }
    ];
    options = {
        responsive: true,
        legend: {
            display: false
        },
        scaleShowVerticalLines: false,
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: '',
                    fontStyle: 'italic'
                },
                ticks: {
                    fontColor: '#4e5f70'
                }
            }],
            xAxes: [{
                ticks: {
                    fontColor: '#4e5f70'
                },
                scaleLabel: {
                    display: true,
                    labelString: '',
                    fontStyle: 'italic'
                }
            }]
        }
    };
    constructor(type, labels, data, axisLabels) {
        this.labels = labels;
        this.options.scales.xAxes[0].scaleLabel.labelString = axisLabels[0];
        this.options.scales.yAxes[0].scaleLabel.labelString = axisLabels[1];
        this.barChartData[0].data = data;
        this.type = type;
    }
}


export class BarChar {
    type;
    labels;
    data;
    colors;
    barChartData = [
        { data: [] }
    ];
    options = {
        responsive: true,
        legend: {
            display: false
        },
        scaleShowVerticalLines: false,
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: '',
                    fontStyle: 'italic'
                },
                ticks: {
                    fontColor: '#4e5f70'
                },
                gridLines: {
                    display: false,
                    drawBorder: false,
                }
            }],
            xAxes: [{
                gridLines: {
                    display: true,
                    drawBorder: false,
                },
                ticks: {
                    fontColor: '#4e5f70'
                },
                scaleLabel: {
                    display: true,
                    labelString: '',
                    fontStyle: 'italic'
                }
            }]
        }
    };
    constructor(type, labels, data, axisLabels, orientation) {
        if (orientation === 'vertical') {
            this.options.scales.yAxes[0].gridLines.display = true;
            this.options.scales.yAxes[0].gridLines.drawBorder = true;
            this.options.scales.xAxes[0].gridLines.display = false;
            this.options.scales.xAxes[0].gridLines.drawBorder = false;
        }
        this.labels = labels;
        this.options.scales.xAxes[0].scaleLabel.labelString = axisLabels[0];
        this.options.scales.yAxes[0].scaleLabel.labelString = axisLabels[1];
        this.barChartData[0].data = data;
        this.type = type;
    }
}

export class PieChar {
    type;
    labels;
    data;
    barChartData;
    colors = [{
        backgroundColor: ['#87dbfe', '#69cef8', '#4bc6f9', '#0599d7']
    }];
    options = {
        responsive: true,
        legend: {
            display: false,
            position: 'bottom',
            reverse: true
        },
        tooltips: {
            displayColors: true,
            callbacks: {
              label: ((tooltipItem) => {
                const index = tooltipItem.index;
                const label = this.labels[index] + ': ' + this.data[index] + '%';
                return label;
              })
            }
          }
    };
    constructor(type, labels, data) {
        this.labels = labels;
        this.data = data;
        this.type = type;
    }
}