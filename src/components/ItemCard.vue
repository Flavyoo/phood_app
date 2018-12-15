<template>
	<div class="card" style="width: 18rem;">
		<div class="card-body">
			<h5 class="card-title">{{ itemTitle }}</h5>
			<h6 class="card-subtitle mb-2 text-muted">{{ itemSubtitle }}</h6>
			<p class="card-text">{{ itemDescription }}</p>
			<p class="card-text">{{ otherInfo }}</p>
			<a href="#" @click.prevent="onDelete" class="card-link">Edit</a>
			<a href="#" @click.prevent="onEdit" class="card-link">Delete</a>
		</div>
	</div>
</template>

<script>
export default {
	name: "ItemCard",
	props: {
		itemTitle: String,
		itemDescription: String,
		itemSubtitle: String,
		otherInfo: String,
		onDelete: Function,
		onEdit: Function
	}
}
</script>
