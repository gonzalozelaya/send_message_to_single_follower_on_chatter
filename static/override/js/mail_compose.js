/* @odoo-module */

import { Composer } from "@mail/core/common/composer";
import { patch } from "@web/core/utils/patch";

console.log('Loaded')
console.log(Composer)

patch(Composer.prototype, {
    setup(){
        super.setup(...arguments);
        this.selectedFollower = useState({
            id: null,
        });
    }
})

patch(Composer.prototype, {
    async sendMessage() {
        if (this.props.composer.message) {
            this.editMessage();
            return;
        }
        await this.processMessage(async (value) => {
            const postData = {
                attachments: this.props.composer.attachments,
                isNote: this.props.type === "note",
                mentionedChannels: this.props.composer.mentionedChannels,
                mentionedPartners: this.selectedFollower.id ? [this.selectedFollower.id] : this.props.composer.mentionedPartners, // Usar el seguidor seleccionado
                cannedResponseIds: this.props.composer.cannedResponses.map((c) => c.id),
                parentId: this.props.messageToReplyTo?.message?.id,
            };
            await this._sendMessage(value, postData);
        });
    },
})