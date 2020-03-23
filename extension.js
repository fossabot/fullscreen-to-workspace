const Meta = imports.gi.Meta;

let _handles = {};
let _previousWorkspace = {};
let wse;

function maximize(act) {
	const win = act.meta_window;
	if (win.window_type !== Meta.WindowType.NORMAL)
		return;
	// If the current workspace doesn't have any other windows make it maximized here.
	if (win.get_workspace().list_windows().filter(w => !w.is_on_all_workspaces()).length == 1)
		return;
	_previousWorkspace[win] = win.get_workspace();
	let lastworkspace = Math.max(1, global.screen.n_workspaces);
	win.change_workspace_by_index(lastworkspace, true, global.get_current_time());
	global.screen.get_workspace_by_index(lastworkspace).activate(global.get_current_time());
}

function unmaximize(act){
	const win = act.meta_window;
	if (win.window_type !== Meta.WindowType.NORMAL)
		return;
	let previous = _previousWorkspace[win];
	delete _previousWorkspace[win];
	if (previous == undefined)
		return;
	let old_ws = win.get_workspace();
	win.change_workspace(previous, true, global.get_current_time());
	previous.activate(global.get_current_time());
	// Don't leave empty created workspaces behind.
	if (old_ws.list_windows().filter(w => !w.is_on_all_workspaces()).length == 0)
		global.screen.remove_workspace(old_ws, global.get_current_time());
}

function bindNewWindows() {
	global.get_window_actors().filter((a) => !(a in _handles)).forEach(function(actor) {
		let resize_event = actor.connect("size-changed", () => {
			if (actor.meta_window.is_fullscreen())
				maximize(actor);
			else
				unmaximize(actor);
		});
		let destroy_event = actor.connect("destroy", () => {
			// TOFIX: this is not really working
			actor.disconnect(resize_event);
			unmaximize(actor);
			delete _handles[actor];
		});
		_handles[actor] = [actor, resize_event, destroy_event];
	});
}


// Mandatory Functions //

function init(extensionMeta) {
	// Nothing to do here, but this function must exist
}

function enable() {
	wse = global.screen.connect("window-added", bindNewWindows);
	// TOFIX: use a better method to bind newly created windows
	bindNewWindows();
}

function disable() {
	for (let actor_s in _handles) {
		if (_handles.hasOwnProperty(actor_s)) {
			let [actor, resize_e, destroy_e] = _handles[actor_s];
			actor.disconnect(resize_e);
			actor.disconnect(destroy_e);
		}
	}
	global.screen.disconnect(wse);
}
