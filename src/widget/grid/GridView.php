<?php

namespace yh\mdc\widget\grid;

use yh\mdc\components\_DataTablePagination;
use yh\mdc\components\_DataTableProgressIndicator;
use yii\widgets\BaseListView;
use yii\helpers\Html;

class GridView extends \yii\grid\GridView
{
    public $dataColumnClass = 'yh\mdc\widget\grid\DataColumn';

    public $tableOptions = [
        'class' => 'mdc-data-table__table',
        'aria-label' => 'Data table'
    ];

    public $options = [
        'class' => 'mdc-data-table'
    ];

    public $tableContainerOptions = [
        'class' => 'mdc-data-table__table-container'
    ];

    public $headerRowOptions = [
        'class' => 'mdc-data-table__header-row'
    ];

    public $bodyOptions = [
        'class' => 'mdc-data-table__content'
    ];

    public $rowOptions = [
        'class' => 'mdc-data-table__row',
    ];

    public $summaryOptions = ['class' => 'mdc-data-table__pagination-total'];

    public $pager = [
        'class' => 'yh\mdc\widget\grid\LinkPager'
    ];

    public $summary = '{begin, number}-{end, number} / <b>{totalCount, number}</b>';

    public $checkBox = false;
    public $progress = true;

    // public $layout = "{items}\n{pager}\n{summary}";
    public $layout = "{items}\n{pager}\n{summary}";

    private _DataTablePagination $_pagination;

    public function init()
    {
        parent::init();
        $this->_pagination = new _DataTablePagination();
        $this->_pagination->grid = $this;

        if ($this->checkBox) {
            $this->rowOptions = function ($model, $key, $index, $grid) {
                return [
                    'class' => 'mdc-data-table__row',
                    'data-row-id' => $this->getRowId($key)
                ];
            };
        }
    }

    public function run()
    {
        BaseListView::run();
    }

    public function getRowId($key): string
    {
        $key = is_array($key) ? json_encode($key) : (string) $key;
        return $this->getId().'-'.$key;
    }

    public function renderTableBody()
    {
        $content = substr(parent::renderTableBody(), 7, -9);
        $content = Html::tag('tbody', $content, $this->bodyOptions);

        return $content;
    }

    public function renderItems()
    {
        $content = Html::tag('div', parent::renderItems(), $this->tableContainerOptions);
        if ($this->progress) {
            $_progress = new _DataTableProgressIndicator();
            $content .= $_progress->renderComponent();
        }
        return $content;
    }

    public function renderSummary()
    {
        $this->_pagination->contentSummary = parent::renderSummary();
        return $this->_pagination->renderComponent();
    }

    public function renderPager()
    {
        $this->_pagination->contentPager = parent::renderPager();
        return '';
    }
}
