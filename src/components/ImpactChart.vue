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
				}
			},
		}
	},
	mounted () {
		this.renderChart({
			labels: ['Waste (Percent)', 'Savings (Thousands)', 'Donations (Percent)'],
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
