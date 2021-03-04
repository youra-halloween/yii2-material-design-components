import { ajax } from './ajax.js'; 

/**
 * 
 * @param {stirng} id - id формы 
 * @param {string} blockedControls - Имеет три состояни
 *  - submit блокировать только submit
 *  - all блокировать все компоненты формы
 *  
 */

function FormProcessing(id, blockedControls = { control: 'submit', unblock: false }) {
    /**
     * Создание объекта, без использования new
     */
    if (!new.target) {
        return new FormProcessing(id, blockedControls);
    }

    let _eventSuccess;

    let _$form = $(`#${id}`);
    let _blockedControls = blockedControls;
    let _submit = app.controls.item(`${id}-submit`);

    _$form.on('afterValidateAttribute', function (_event, attribute, messages) {
        var control = app.controls.item(attribute.id);
        if (control.helperMessage) {
            var text = messages.length > 0 ? messages[0] : '';
            //Первоначально изменить Valid, после чего error=text, выполнит рендер Helper
            control.valid = messages.length == 0;
            control.helperMessage.error = text;
        }
    });

    _$form.on('beforeSubmit', () => {
        _submit.disabled = _blockedControls.control == 'submit';

        let ax = ajax(_$form);

        if (_blockedControls.control == 'all') {
            app.controls.groupEnabled(_$form.attr('id'), false);
        }

        ax.done((data) => {
                if (data.status === 'success') {
                    _eventSuccess(data);
                } else if (data.status === 'model-error') {
                    let focusField = false;
                    let snackbar = app.controls.item('app-snackbar');
                    for (let key in data.message) {
                        data.message[key].forEach((item) => {
                            snackbar.add(item);
                        })
                        if (key.trim() !== '') {
                            let control = app.controls.item(key);
                            
                            if (!focusField) {
                                control.focus();
                                focusField = true;
                            }
                            
                            control.valid = false;
                            control.helperMessage.error = data.message[key][0];
                        }
                    }
                    snackbar.showMessage();
                }
            })
            .complete((data) => {
                let unblock = _blockedControls.unblock || !(data.status === 'success');

                if (_blockedControls.control == 'all') {
                    app.controls.groupEnabled(_$form.attr('id'), unblock);
                } else {
                    _submit.disabled = !unblock;
                }
            })
            .post();
        return false;
    });

    /**     
     * @param {callback} fn - вызывается в случае успешного выполнения
     */
    FormProcessing.prototype.eventSuccess = function (fn) {
        _eventSuccess = fn;
    };

    Object.defineProperty(FormProcessing.prototype, "id", {
        get: function () {
            return _$form.attr('id');
        },
        set: function (value) {
            if (this.id != value) {
                _$form.attr('id', value);
            }
        },
        enumerable: true,
        configurable: true
    });
}

export { FormProcessing };