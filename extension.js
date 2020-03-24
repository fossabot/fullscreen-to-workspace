const Meta = imports.gi.Meta;
const Mainloop = imports.mainloop;

let _handles, _previousWorkspace, _wsadd_event, _wsdel_event;

function maximize(win) {
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

function unmaximize(win, clean_ws) {
	if (win.window_type !== Meta.WindowType.NORMAL)
		return;
	let previous = _previousWorkspace[win];
	delete _previousWorkspace[win];
	if (previous == undefined)
		return;
	let old_ws = clean_ws || win.get_workspace();
	if (!clean_ws)
		win.change_workspace(previous, true, global.get_current_time());
	previous.activate(global.get_current_time());
	// Don't leave empty created workspaces behind.
	if (old_ws.list_windows().filter(w => !w.is_on_all_workspaces()).length == 0)
		global.screen.remove_workspace(old_ws, global.get_current_time());
}

function handleResize(actor) {
	let win = actor.meta_window;
	if (win.is_fullscreen())
		maximize(win);
	else
		unmaximize(win);
}


// Mandatory Functions //

function init(extensionMeta) {
	_handles = {};
	_previousWorkspace = {};
}

function enable() {
	// TODO: maybe use a better method to extract parent actor.
	// the problem is that `window-added`/`window-removed` only give screen and a window
	// but `size-changed` requires the parent actor, how to get it in a meaningful way?
	_wsadd_event = global.screen.connect("window-added", (_, win) => {
		if (win.window_type !== Meta.WindowType.NORMAL)
			return;
		// for some reason we need to idle, otherwise the window is not captured
		// among the global actors yet
		Mainloop.idle_add(() => {
			let actor = global.get_window_actors().filter((act) => act.meta_window == win)[0];
			if (actor in _handles)
				return;
			let resize_event = actor.connect("size-changed", handleResize);
			_handles[actor] = [actor, resize_event];
		});
	});
	_wsdel_event = global.screen.connect("window-removed", (_, win) => {
		if (win.window_type !== Meta.WindowType.NORMAL)
			return;
		let actor = global.get_window_actors().filter((act) => act.meta_window == win)[0];
		if (!(actor in _handles))
			return;
		if (win.is_fullscreen())
			unmaximize(win, true); // TOFIX: how to find the old workspace?
		delete _handles[actor];
	});
	// bind existing windows
	global.get_window_actors().forEach((actor) => {
		let resize_event = actor.connect("size-changed", handleResize);
		_handles[actor] = [actor, resize_event];
	});
}

function disable() {
	Object.keys(_handles).forEach((actor_s) => {
		let [actor, resize_e] = _handles[actor_s];
		actor.disconnect(resize_e);
	});
	global.screen.disconnect(_wsadd_event);
	global.screen.disconnect(_wsdel_event);
}
