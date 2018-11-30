<script>
import { Bar } from 'vue-chartjs'

export default {
	name: 'ImpactChart',
	extends: Bar,
	data () {
		return {
			options: {
				responsive: true,
				maintainAspectRatio: true,
				scales: {
					yAxes: [{
						ticks: {
							max: 100,
							beginAtZero: true
						},
						gridLines: {
							display: true
						}
					}],
				},
				title: {
					display: true,
					text: "Check It Out!!",
					fontSize: 26,
					fontFamily: "'Roboto', sans-serif"
				},
				tooltips: {
					callbacks: {
						afterTitle: function(tooltipItem) {
							if (tooltipItem[0].xLabel !== 'Savings') {
								return "Percent"
							} else {
								return "In thousands"
							}
						}
					}
				}
			},
		}
	},
	mounted () {
		this.renderChart({
			labels: ['Waste Reduced', 'Savings', 'Donations'],
			datasets: [
				{
					label: "Phood's Impact",
					backgroundColor: '#0069ff',
					data: [50, 60, 30],
					fontSize: 8,
					color: '#0069ff'
				}
			]},
			this.options
		)
	}
}
</script>
