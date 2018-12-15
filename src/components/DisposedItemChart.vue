<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  }),

  mounted () {
    this.renderChart({
		labels: ['12/10', '12/11', '12/12', '12/13', '12/14', '12/15', '12/16'],
		datasets: [
			{
				label: "This Week's Waste",
				backgroundColor: '#0069ff',
				data: [40, 20, 70, 38, 34, 189,50, 10]
			}
		]},
		this.options
	)
  }
}
</script>
