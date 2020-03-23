const Meta = imports.gi.Meta;

let _handles = {};
let _previousWorkspace = {};
let wse;

function maximize(act) {
	const win = act.meta_window;
	if (win.window_type !== Meta.WindowType.NORMAL)
		return;
	// If the current workspace doesn't have any other windows make it maximized here.
	if (global.screen.get_active_workspace().list_windows().filter(w => !w.is_on_all_workspaces()).length == 1)
		return;
	_previousWorkspace[win] = global.screen.get_active_workspace_index();
	let lastworkspace = Math.max(1, global.screen.n_workspaces);
	win.change_workspace_by_index(lastworkspace, true, global.get_current_time());
	global.screen.get_workspace_by_index(lastworkspace).activate(global.get_current_time());
}

function unmaximize(act){
	const win = act.meta_window;
	if (win.window_type !== Meta.WindowType.NORMAL)
		return;
	let previous = _previousWorkspace[win];
	if (previous == undefined)
		return;
	let cws = global.screen.get_active_workspace();
	win.change_workspace_by_index(previous, true, global.get_current_time());
	global.screen.get_workspace_by_index(previous).activate(global.get_current_time());
	// Don't leave empty created workspaces behind.
	if (cws.list_windows().filter(w => !w.is_on_all_workspaces()).length == 0)
		global.screen.remove_workspace(cws, global.get_current_time());
}


function handleResize(act) {
	if (act.meta_window.is_fullscreen())
		maximize(act);
	else
		unmaximize(act);
}

function bindNewWindows() {
	global.get_window_actors().filter((a) => !(a in _handles)).forEach(function(actor) {
		let resize  = actor.connect("size-changed", () => handleResize(actor));
		let destroy = actor.connect("destroy", function() { actor.disconnect(resize); delete _handles[actor]; });
		_handles[actor] = (resize, destroy);
	});
}


// Mandatory Functions //

function init(extensionMeta) {

}

function enable() {
	wse = global.screen.connect("window-added", bindNewWindows);
	// TOFIX: use a better method to bind newly created windows
	bindNewWindows();
}

function disable() {
	for (let act in _handles) {
		if (object.hasOwnProperty(act)) {
			let resize, destroy = _handles[act];
			act.disconnect(resize);
			act.disconnect(destroy);
		}
	}
	global.screen.disconnect(wse);
	// TOFIX: Cinnamon crashes here
}
